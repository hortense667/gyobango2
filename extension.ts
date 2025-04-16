import * as vscode from 'vscode';

/**
 * 拡張機能が有効化された際に呼び出される関数。
 * ここでコマンド登録などの初期化処理を行う。
 */
export function activate(context: vscode.ExtensionContext) {

    // 初回実行時または実行中に使用する変数
    // - existingDoc: 数字を挿入するドキュメント（新規作成・再利用する場合がある）
    // - initialEditor: コマンドを初めて実行したときのエディター
    // - initialDoc: コマンドを初めて実行したときのドキュメント
    let existingDoc: vscode.TextDocument | null = null;
    let initialEditor: vscode.TextEditor | null = null;
    let initialDoc: vscode.TextDocument | null = null;

    /**
     * コマンド 'gyobango2.GyoBango2' を登録する。
     * コマンドが実行されたら performTask() を呼び出す。
     */
    let disposable = vscode.commands.registerCommand('gyobango2.GyoBango2', () => {
        performTask();
    });

    // このコマンド登録を拡張機能の管理対象 (subscription) に加えておく
    context.subscriptions.push(disposable);

    /**
     * コマンドが呼び出されたときに実行されるメイン処理。
     * 非同期関数として定義しているため、await が使用できる。
     */
    async function performTask() {
        // 現在アクティブなエディターを取得
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("エディターが見つかりません。");
            return;
        }

        // initialEditor が未設定であれば、今回のエディターとドキュメントを保存しておく
        if (!initialEditor) {
            initialEditor = editor;
            initialDoc = editor.document;
        }

        // 現在のカーソル位置を保持する (originalPos)
        // また、もともとのドキュメント (originalDoc) と表示カラム (originalViewColumn) を記憶
        const originalPos = editor.selection.active;
        const originalDoc = editor.document;
        let originalViewColumn = editor.viewColumn;

        // カーソルを上に動かせるだけ動かし、何回動いたか (count) を数える
        // wrappedLine は折り返し行ごとに動く指定ができるが、ここでは1行単位で動いているイメージ
        let count = 0;
        while (true) {
            const currentPos = editor.selection.active;

            // VSCode のコマンド 'cursorMove' を使って、カーソルを1つ上に移動
            await vscode.commands.executeCommand('cursorMove', {
                to: 'up',
                by: 'wrappedLine',
                value: 1,
                select: false
            });

            // 移動後のカーソル位置を取得し、移動できなければループを抜ける
            const newPos = editor.selection.active;
            if (newPos.line === currentPos.line && newPos.character === currentPos.character) {
                // 位置が変わっていない => これ以上上に行けないので終了
                break;
            }
            count++;
        }

        // カーソルをその行の先頭（折り返し行も考慮した上で）に移動
        await vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineStart' });

        // カーソルを元の位置に戻し、画面上で見えるように再描画
        editor.selection = new vscode.Selection(originalPos, originalPos);
        editor.revealRange(new vscode.Range(originalPos, originalPos));

        // もし現在のエディターが左カラム(1)であれば、右カラム(2)へ移動する
        // (再度元に戻す際の位置管理のために originalViewColumn を更新)
        if (editor.viewColumn === vscode.ViewColumn.One) {
            await vscode.commands.executeCommand('workbench.action.moveEditorToRightGroup');
            originalViewColumn = vscode.ViewColumn.Two;
        }

        // 新規エディター (newEditor) を用意する。
        // もし既存のドキュメント (existingDoc) があればそれを開き、なければ新しく作成する。
        let newEditor: vscode.TextEditor;
        if (existingDoc) {
            // すでに作成済みのドキュメントがある場合は再表示
            newEditor = await vscode.window.showTextDocument(existingDoc, vscode.ViewColumn.One);
        } else {
            // 新規に空のドキュメントを作り、そのエディターを開く
            const newDoc = await vscode.workspace.openTextDocument({ content: '' });
            existingDoc = newDoc;
            newEditor = await vscode.window.showTextDocument(newDoc, vscode.ViewColumn.One);
        }

        // 既存のドキュメントにすでに書かれている 5 桁の数字だけを取り出す
        // /^\d{5}$/ => 行全体が5桁の数字のみで構成されているかを判定する正規表現
        const existingLines = existingDoc.getText().split('\n').filter(line => line.trim().match(/^\d{5}$/));

        // 既存の行のうち最後の数字を取得（ない場合は0）
        let lastNumber = existingLines.length > 0 ? parseInt(existingLines[existingLines.length - 1]) : 0;

        // すでに生成済みの数字を Set として保管しておき、重複をチェックしやすくする
        let generatedNumbers = new Set(existingLines.map(num => parseInt(num)));

        // 新規に生成する数字の範囲を決定
        // - start: 既存の最後の数字 + 1
        // - end: count + 100 と start の大きい方 (最低でも100行分は追加するイメージ)
        const start = lastNumber + 1;
        const end = Math.max(start, count + 100);

        // 新規に追加する数字を一時的に保持する配列
        let newLines: string[] = [];

        // start から end までループし、まだ生成されていない数字 (generatedNumbers にないもの) をピックアップ
        for (let num = start; num <= end; num++) {
            if (!generatedNumbers.has(num)) {
                // 5桁になるようにゼロ埋め(padStart)する
                newLines.push(num.toString().padStart(5, '0'));
            }
        }

        // 新規行があれば、編集を行ってドキュメントに追記する
        if (newLines.length > 0) {
            await newEditor.edit(editBuilder => {
                // 挿入先の位置を既存行数の末尾とし、そこに改行 + 新しい行をまとめて挿入
                let insertPos = new vscode.Position(existingLines.length, 0);

                // 既に何行か存在していたら、その末尾には改行を付けてから追記する
                editBuilder.insert(
                    insertPos,
                    (existingLines.length > 0 ? '\n' : '') + newLines.join('\n')
                );
            });
        }

        // カーソルを移動する先の行を決定する:
        // - count - 1 行目と、ドキュメントの最終行数 - 1 のうち小さい方を採用（行き過ぎないように）
        let targetLine = Math.min(count - 1, newEditor.document.lineCount - 1);

        // 万が一 targetLine が負にならないようにする (0未満なら0を適用)
        if (targetLine < 0) {
            targetLine = 0;
        }
        // +++ おまじない
        const targetPosx = new vscode.Position(0, 0);

        // 新規エディターのカーソルを targetPosx に設定し、画面に見えるようにする
        newEditor.selection = new vscode.Selection(targetPosx, targetPosx);
        newEditor.revealRange(new vscode.Range(targetPosx, targetPosx));
        // ｰｰｰ おまじない


        // 実際に移動するカーソル位置を作成 (行は targetLine+1 にしている)
        // ※ ここで +1 しているのは「意図的に1行下を狙っている」可能性がある
        const targetPos = new vscode.Position(targetLine + 1, 0);

        // 新規エディターのカーソルを targetPos に設定し、画面に見えるようにする
        newEditor.selection = new vscode.Selection(targetPos, targetPos);
        newEditor.revealRange(new vscode.Range(targetPos, targetPos));

        // 初期ドキュメントが存在し、かつそれが existingDoc と異なる場合のみ、
        // 一度初期ドキュメントを開いてすぐ閉じる => 不要なタブを整理する意図か
        if (initialDoc && initialDoc !== existingDoc) {
            // 初期ドキュメントが空の場合のチェック:
            // ・getText().trim() が空文字なら中身は空とみなす
            // ・ただし、ドキュメントが "untitled"（未保存）の場合は、空であれば処理をスキップ
            const isEmpty = initialDoc.getText().trim() === '';
            const isUntitled = initialDoc.uri.scheme === 'untitled';
        
            // 空かつ未保存の場合は処理をスキップ。それ以外は処理する
            if (!(isEmpty && isUntitled)) {
                // 初期ドキュメントをアクティブにする
                await vscode.window.showTextDocument(initialDoc, { viewColumn: vscode.ViewColumn.One });
                // 自動で保存（変更があればダイアログを表示せずに保存）
                await vscode.commands.executeCommand('workbench.action.files.save');
        
                // 保存後に短い遅延を入れて、状態が反映されるのを待つ
                await new Promise(resolve => setTimeout(resolve, 100));
        
                // アクティブなエディター（初期ドキュメント）を閉じる
                await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            }
        }
        
        // 元のドキュメント (originalDoc) を元のカラム (originalViewColumn) で再表示
        await vscode.window.showTextDocument(originalDoc, { viewColumn: originalViewColumn });

        // 最後に、現在開いている全てのエディターに対して、カーソルを1行上→1行下へ移動
        // 表示リフレッシュや位置同期のための処理と考えられる
        for (const ed of vscode.window.visibleTextEditors) {
            await vscode.commands.executeCommand('cursorMove', {
                to: 'up',
                by: 'wrappedLine',
                value: 1,
                select: false
            });
            await vscode.commands.executeCommand('cursorMove', {
                to: 'down',
                by: 'wrappedLine',
                value: 1,
                select: false
            });
        }
    }
}

/**
 * 拡張機能が非アクティブ化された時に呼び出される関数。
 * ここでは特に処理を行っていない。
 */
export function deactivate() {}
