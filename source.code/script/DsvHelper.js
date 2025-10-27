/* ================================================================ */
/* DsvHelper Class                                                  */
/* ================================================================ */
class DsvHelper {
	//#region メンバー変数定義
	/** @type {string} 回避文字 */
	#textCharacter;
	/** @type {string} 項目区切 */
	#itemDelimiter;
	/** @type {string} 要素区切 */
	#lineDelimiter;
	//#endregion メンバー変数定義

	//#region プロパティー定義
	/**
	 * 文字切替を取得します。
	 *
	 * @returns {string} 文字切替
	 */
	get textCharacter() {
		return this.#textCharacter;
	}
	/**
	 * 文字切替を設定します。
	 *
	 * @param {string} update 文字切替
	 * @throws <code>update</code>が文字列ではない場合
	 * @throws <code>update</code>が１文字ではない場合
	 */
	set textCharacter(update) {
		this.#setTextCharacter(update);
	}

	/**
	 * 項目区切を取得します。
	 *
	 * @returns {string} 項目区切
	 */
	get itemDelimiter() {
		return this.#itemDelimiter;
	}
	/**
	 * 項目区切を設定します。
	 *
	 * @param {string} update - 項目区切
	 * @throws <code>update</code>が文字列ではない場合
	 */
	set itemDelimiter(update) {
		this.#setItemDelimiter(update);
	}

	/**
	 * 要素区切を取得します。
	 *
	 * @returns {string} 要素区切
	 */
	get lineDelimiter() {
		return this.#lineDelimiter;
	}
	/**
	 * 要素区切を設定します。
	 *
	 * @param {string} update - 要素区切
	 * @throws <code>update</code>が文字列ではない場合
	 */
	set lineDelimiter(update) {
		this.#setLineDelimiter(update);
	}
	//#endregion プロパティー定義

	//#region 生成メソッド定義:Constructor
	/**
	 * DSV解析処理を生成します。
	 */
	constructor() {
		this.#textCharacter = '"';
		this.#itemDelimiter = ',';
		this.#lineDelimiter = '\r\n';
	}
	//#endregion 生成メソッド定義:Constructor

	//#region 内部メソッド定義:#setTextCharacter/#setItemDelimiter/#setLineDelimiter
	/**
	 * 文字切替を設定します。
	 *
	 * @param {string} update 文字切替
	 * @throws <code>update</code>が文字列ではない場合
	 * @throws <code>update</code>が１文字ではない場合
	 */
	#setTextCharacter(update) {
		if (Object.prototype.toString.call(update) !== '[object String]') {
			throw new Error("textCharacter must be string.");
		} else if (update.length !== 1) {
			throw new Error("textCharacter must be character.");
		} else {
			this.#textCharacter = update;
		}
	}
	/**
	 * 項目区切を設定します。
	 *
	 * @param {string} update - 項目区切
	 * @throws <code>update</code>が文字列ではない場合
	 */
	#setItemDelimiter(update) {
		if (Object.prototype.toString.call(update) === '[object String]') {
			this.#itemDelimiter = update;
		} else {
			throw new Error("itemDelimiter must be string.");
		}
	}
	/**
	 * 要素区切を設定します。
	 *
	 * @param {string} update - 要素区切
	 * @throws <code>update</code>が文字列ではない場合
	 */
	#setLineDelimiter(update) {
		if (Object.prototype.toString.call(update) === '[object String]') {
			this.#lineDelimiter = update;
		} else {
			throw new Error("lineDelimiter must be string.");
		}
	}
	//#endregion 内部メソッド定義:#setTextCharacter/#setItemDelimiter/#setLineDelimiter

	/**
	 * 項目情報を復号します。
	 *
	 * @param {string} source - 項目情報
	 * @returns {string} - 復号情報
	 */
	#decodeText(source) {
		let length = source.length;
		let escape = false;
		let result = '';
		for (let index = 0; index < length; index ++) {
			let choose = source[index];
			if (choose === this.#textCharacter) {
				if (escape === false) result += choose;
				escape = !escape;
			} else if (escape === false) {
				result += choose;
			} else {
				throw new Error('Must be duplicated escape character.');
			}
		}
		if (escape === false) {
			return result;
		} else {
			throw new Error('Must be duplicated escape character.');
		}
	}
	/**
	 * 項目情報を復号します。
	 *
	 * @param {string} source - 項目情報
	 * @returns {string} - 復号情報
	 */
	#decodeItem(source) {
		if (2 <= source.length && source[0] === this.#textCharacter && source[source.length - 1] === this.#textCharacter) {
			return this.#decodeText(source.substring(1, source.length - 1));
		} else {
			return this.#decodeText(source);
		}
	}

	#decodeLine(source) {
		let result = [];
		let length = source.length;
		let ignore = false;
		let offset = 0;
		for (let index = 0; index < length; index ++) {
			let choose = source[index];
			if (choose === this.#textCharacter) {
				// 回避情報である場合：状態反転
				ignore = !ignore;
			} else if (ignore) {
				// 除外状態である場合：処理なし
			} else if (choose === this.#itemDelimiter) {
				// 項目区切である場合：解析処理
				result.push(this.#decodeItem(source.substring(offset, index)));
				offset = index + 1;
			}
		}
		if (offset <= length) {
			result.push(this.#decodeItem(source.substring(offset)));
		}
		return result;
	}

	decodeText(source) {
		if (Object.prototype.toString.call(source) !== '[object String]') {
			throw new Error('Must be string.');
		} else {
			let result = [];
			let length = source.length;
			let ignore = false;
			let offset = 0;
			for (let index = 0; index < length; index ++) {
				let choose = source[index];
				if (choose === this.#textCharacter) {
					// 回避情報である場合：状態反転
					ignore = !ignore;
				} else if (ignore) {
					// 除外状態である場合：処理なし
				} else if (source.startsWith(this.#lineDelimiter, index)) {
					// 要素区切である場合：解析処理
					result.push(this.#decodeLine(source.substring(offset, index)));
					offset = index + 1;
				}
			}
			if (offset < length) {
				result.push(this.#decodeLine(source.substring(offset)));
			}
			return result;
		}
	}
}
