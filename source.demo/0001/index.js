(function() {
	document.addEventListener('DOMContentLoaded', () => {
		/** @type {HTMLTextAreaElement} */
		const source = document.querySelector('textarea[data-action="source"]');
		/** @type {HTMLButtonElement} */
		const button = document.querySelector('button[data-action="decode"]');

		const helper = new DsvHelper();
		helper.lineDelimiter = '\n';

		button.addEventListener('click', () => {
			console.info('[開始]解析処理');
			try {
				const result = helper.decodeText(source.value);
				console.info('[終了]解析処理', result);
			} catch {
				console.error('[失敗]解析処理');
			}
		});
	});
})();
