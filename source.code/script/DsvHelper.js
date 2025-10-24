/* ================================================================ */
/* DsvHelper Class                                                  */
/* ================================================================ */
class DsvHelper {
	//#region メンバー変数定義
	/** @type {string} 回避文字 */
	#textCharacter;
	/** @type {string} 区切文字 */
	#itemDelimiter;
	/** @type {string} 区切文字 */
	#lineDelimiter;
	//#endregion メンバー変数定義

	//#region プロパティー定義
	get textCharacter() {
		return this.#textCharacter;
	}
	set textCharacter(update) {
		if (Object.prototype.toString.call(update) === '[object String]') {
			this.#textCharacter = update;
		} else {
			throw new Error("textCharacter can not setting not string.");
		}
	}

	get itemDelimiter() {
		return this.#itemDelimiter;
	}
	set itemDelimiter(update) {
		if (Object.prototype.toString.call(update) === '[object String]') {
			this.#itemDelimiter = update;
		} else {
			throw new Error("itemDelimiter can not setting not string.");
		}
	}

	get lineDelimiter() {
		return this.#lineDelimiter;
	}
	set lineDelimiter(update) {
		if (Object.prototype.toString.call(update) === '[object String]') {
			this.#lineDelimiter = update;
		} else {
			throw new Error("lineDelimiter can not setting not string.");
		}
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
