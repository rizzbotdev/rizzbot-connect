// ==UserScript==
// @name         RizzBot Connect
// @namespace    https://rizzbotproject.vercel.app
// @version      1.15.0
// @author       rizzbotdev
// @description  Bring girls into RizzBot from the sites you use in your browser. Instagram: add her from her profile, with your chat. Reads only what you can see; never likes, follows or views a story. Tinder: a status badge on every match and chat, chats synced by themselves, and one-press import. Reads only what Tinder already loaded; never sends Tinder a request or presses its buttons.
// @license      UNLICENSED
// @icon         https://rizzbotproject.vercel.app/icon.png
// @homepageURL  https://github.com/rizzbotdev/rizzbot-connect
// @supportURL   https://github.com/rizzbotdev/rizzbot-connect/issues
// @downloadURL  https://github.com/rizzbotdev/rizzbot-connect/releases/latest/download/rizzbot-connect.user.js
// @updateURL    https://github.com/rizzbotdev/rizzbot-connect/releases/latest/download/rizzbot-connect.meta.js
// @include      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//
// @match        https://www.instagram.com/*
// @match        https://tinder.com/*
// @match        https://rizzbotproject.vercel.app/*
// @sandbox      raw
// @connect      rizzbotproject.vercel.app
// @connect      localhost
// @connect      127.0.0.1
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @inject-into  page
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
	"use strict";
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var _GM_addValueChangeListener = (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
	var _GM_deleteValue = (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
	var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
	var _GM_openInTab = (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
	var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
	var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _GM_unregisterMenuCommand = (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
	var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
	var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
	var jsonParse = JSON.parse;
	var jsonStringify = JSON.stringify;
	var apply = Reflect.apply;
	var ownKeys = Reflect.ownKeys;
	var isArray = Array.isArray;
	var attachShadow = typeof Element !== "undefined" ? Element.prototype.attachShadow : void 0;
	var parseJson = (text) => apply(jsonParse, JSON, [text]);
	var stringifyJson = (value) => apply(jsonStringify, JSON, [value]);
	function signatureOf(v, depth = 0) {
		if (depth > 20) return "~";
		if (v === null) return "null";
		const t = typeof v;
		if (t === "undefined") return "u";
		if (t === "function") return "f";
		if (t === "string") return `s${v.length}:${v}`;
		if (t === "number" || t === "boolean" || t === "bigint") return `${t[0]}${v}`;
		if (t !== "object") return "?";
		if (isArray(v)) {
			let out = "[";
			for (let i = 0; i < v.length; i++) out += `${signatureOf(v[i], depth + 1)},`;
			return `${out}]`;
		}
		let out = "{";
		for (const k of ownKeys(v)) {
			if (typeof k !== "string") continue;
			const x = v[k];
			if (x === void 0) continue;
			out += `${k.length}:${k}=${signatureOf(x, depth + 1)};`;
		}
		return `${out}}`;
	}
	function closedShadow(el) {
		return attachShadow ? apply(attachShadow, el, [{ mode: "closed" }]) : el.attachShadow({ mode: "closed" });
	}
	function isTokenShape(t) {
		if (typeof t !== "string" || t.length !== 68) return false;
		if (t[0] !== "r" || t[1] !== "z" || t[2] !== "r" || t[3] !== "_") return false;
		for (let i = 4; i < 68; i++) {
			const c = t[i];
			if (!(c >= "0" && c <= "9" || c >= "a" && c <= "f")) return false;
		}
		return true;
	}
	var RAW = new WeakMap();
	function registerScoped(scoped, whole) {
		RAW.set(scoped, whole);
	}
	function rawHost(host) {
		return RAW.get(host) ?? host;
	}
	var PRODUCTION_ORIGIN = "https://rizzbotproject.vercel.app";
	function isAllowedOrigin(origin) {
		return origin === "https://rizzbotproject.vercel.app" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d{2,5})?$/.test(origin);
	}
	var ORIGIN_KEY = "origin";
	var CONNECTIONS_KEY = "connections";
	function currentOrigin(host) {
		const o = rawHost(host).get(ORIGIN_KEY, PRODUCTION_ORIGIN);
		return isAllowedOrigin(o) ? o : PRODUCTION_ORIGIN;
	}
	function setOrigin(host, origin) {
		const o = origin.trim().replace(/\/+$/, "");
		if (!isAllowedOrigin(o)) return false;
		rawHost(host).set(ORIGIN_KEY, o);
		return true;
	}
	function all(host) {
		const v = rawHost(host).get(CONNECTIONS_KEY, {});
		return v && typeof v === "object" ? v : {};
	}
	function connectionFor(host, origin) {
		const c = all(host)[origin];
		return c && isTokenShape(c.token) ? c : null;
	}
	function saveConnection(host, origin, c) {
		rawHost(host).set(CONNECTIONS_KEY, {
			...all(host),
			[origin]: c
		});
	}
	function clearConnection(host, origin) {
		const next = { ...all(host) };
		delete next[origin];
		rawHost(host).set(CONNECTIONS_KEY, next);
	}
	function browserLabel(ua) {
		const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "a browser";
		const os = /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Android/.test(ua) ? "Android" : /Linux/.test(ua) ? "Linux" : /iPhone|iPad/.test(ua) ? "iOS" : "";
		return os ? `${browser} on ${os}` : browser;
	}
	var ApiError = class extends Error {
		status;
		body;
		constructor(message, status, body) {
			super(message);
			this.status = status;
			this.body = body;
			this.name = "ApiError";
		}
	};
	var NotConnectedError = class extends Error {
		constructor() {
			super("RizzBot Connect is not connected to your account yet.");
			this.name = "NotConnectedError";
		}
	};
	function parse(text) {
		try {
			const v = parseJson(text);
			return v && typeof v === "object" && !Array.isArray(v) ? v : null;
		} catch {
			return null;
		}
	}
	function messageFor(status, body, origin) {
		const own = typeof body?.error === "string" && body.error.trim() ? body.error.trim() : null;
		if (status === 0) return `Could not reach RizzBot at ${origin}. Check your connection and try again.`;
		if (status === 401) return "RizzBot Connect was disconnected from your account. Connect it again.";
		if (own) return own;
		if (status === 413) return "That was too big for RizzBot to take in one go.";
		if (status === 429) return "RizzBot asked to slow down. Wait a minute and try again.";
		if (status >= 500) return `RizzBot had a problem (${status}). Try again in a minute.`;
		return `RizzBot answered ${status}.`;
	}
	function createApi(host, origin = currentOrigin(host)) {
		async function send(method, path, body, token, timeoutMs) {
			const headers = {
				accept: "application/json",
				...body !== void 0 ? { "content-type": "application/json" } : {},
				...token ? { authorization: `Bearer ${token}` } : {}
			};
			const r = await host.request({
				method,
				url: origin + path,
				headers,
				...body !== void 0 ? { body: stringifyJson(body) } : {},
				timeoutMs
			});
			const json = parse(r.text);
			if (r.status >= 200 && r.status < 300) {
				if (!json || typeof json !== "object") throw new ApiError(`RizzBot at ${origin} answered something unexpected. Try again in a minute.`, r.status, null);
				return json;
			}
			if (r.status === 401 && token && connectionFor(host, origin)?.token === token) clearConnection(host, origin);
			throw new ApiError(messageFor(r.status, json, origin), r.status, json);
		}
		return {
			origin,
			connected: () => connectionFor(host, origin) !== null,
			call: (method, path, body, timeoutMs = 9e4) => {
				const c = connectionFor(host, origin);
				if (!c) return Promise.reject(new NotConnectedError());
				return send(method, path, body, c.token, timeoutMs);
			},
			callAnonymous: (method, path, body) => send(method, path, body, null, 3e4)
		};
	}
	var MSG = {
		ping: "rizzbot-connect:ping",
		hello: "rizzbot-connect:hello",
		code: "rizzbot-connect:code",
		done: "rizzbot-connect:done",
		error: "rizzbot-connect:error"
	};
	function connectUrl(origin, ua) {
		return `${origin}/recorder/connect?app=connect&pc=${encodeURIComponent(browserLabel(ua))}`;
	}
	function isConnectPage(loc) {
		return isAllowedOrigin(loc.origin) && /^\/recorder\/connect\/?$/.test(loc.pathname) && new URLSearchParams(loc.search).get("app") === "connect";
	}
	function openConnect(host, ua) {
		host.openTab(connectUrl(currentOrigin(host), ua));
	}
	function runConnectPage(host, win) {
		const origin = win.location.origin;
		if (!isConnectPage(win.location)) return;
		const say = (type, data) => win.postMessage({
			type,
			...data
		}, origin);
		const hello = () => say(MSG.hello, { version: host.version });
		let busy = false;
		win.addEventListener("message", async (e) => {
			if (e.source !== win || e.origin !== origin) return;
			const d = e.data;
			if (d?.type === MSG.ping) return hello();
			if (!d || d.type !== MSG.code || typeof d.code !== "string" || busy) return;
			busy = true;
			try {
				if (origin !== "https://rizzbotproject.vercel.app" && currentOrigin(host) !== origin) throw new Error(`This is a dev server. In the Tampermonkey menu, choose Which RizzBot site, enter ${origin}, then press Connect again.`);
				const r = await createApi(host, origin).callAnonymous("POST", "/api/recorder/redeem", { code: d.code });
				if (!isTokenShape(r.token)) throw new Error("RizzBot did not hand back a token.");
				const email = typeof r.email === "string" ? r.email : null;
				saveConnection(host, origin, {
					token: r.token,
					email,
					connectedAt: new Date().toISOString()
				});
				setOrigin(host, origin);
				say(MSG.done, { email });
			} catch (err) {
				say(MSG.error, { message: err instanceof Error ? err.message : "Could not connect." });
			} finally {
				busy = false;
			}
		});
		hello();
	}
	var gmHost = {
		get: (key, fallback) => _GM_getValue(key, fallback),
		set: (key, value) => _GM_setValue(key, value),
		del: (key) => _GM_deleteValue(key),
		request: (req) => new Promise((resolve) => {
			_GM_xmlhttpRequest({
				method: req.method,
				url: req.url,
				headers: req.headers ?? {},
				...req.body !== void 0 ? { data: req.body } : {},
				timeout: req.timeoutMs ?? 6e4,
				anonymous: true,
				onload: (r) => resolve({
					status: r.status,
					text: typeof r.responseText === "string" ? r.responseText : ""
				}),
				onerror: () => resolve({
					status: 0,
					text: ""
				}),
				ontimeout: () => resolve({
					status: 0,
					text: "timeout"
				}),
				onabort: () => resolve({
					status: 0,
					text: "aborted"
				})
			});
		}),
		openTab: (url, opts) => {
			_GM_openInTab(url, {
				active: !opts?.background,
				insert: true
			});
		},
		menu: (label, fn) => _GM_registerMenuCommand(label, fn),
		unmenu: (id) => {
			if (typeof _GM_unregisterMenuCommand === "function" && id !== void 0 && id !== null) _GM_unregisterMenuCommand(id);
		},
		onChange: (key, fn) => {
			if (typeof _GM_addValueChangeListener !== "function") return;
			_GM_addValueChangeListener(key, (_name, _old, value, remote) => {
				if (remote) fn(value);
			});
		},
		version: _GM_info?.script?.version ?? "dev"
	};
	var FOLLOW_KEYS = {
		on: "followChats",
		target: "followTarget",
		leader: "followLeader",
		opened: "followOpenedAt"
	};
	var followTiming = {
		beatMs: 4e3,
		staleMs: 12e3,
		freshMs: 15e3,
		openCooldownMs: 15e3,
		ackMs: 400
	};
	var FOLLOW_MSG = {
		navigate: "rizzbot-connect:navigate",
		navigated: "rizzbot-connect:navigated"
	};
	function followEnabled(host) {
		return rawHost(host).get(FOLLOW_KEYS.on, false) === true;
	}
	function setFollow(host, on) {
		rawHost(host).set(FOLLOW_KEYS.on, on);
	}
	function isFollowUrl(url, origin) {
		let u;
		try {
			u = new URL(url);
		} catch {
			return false;
		}
		return u.origin === origin && isAllowedOrigin(origin) && /^\/chats\/[^/]+$/.test(u.pathname) && (u.search === "" || u.search === "?review=tinder") && u.hash === "";
	}
	function leaderOf(host) {
		const l = rawHost(host).get(FOLLOW_KEYS.leader, null);
		return l && typeof l.id === "string" && typeof l.at === "number" ? l : null;
	}
	function alive(l, now) {
		return !!l && now - l.at < followTiming.staleMs;
	}
	function followChat(host, url, now = Date.now()) {
		if (!followEnabled(host)) return "off";
		const raw = rawHost(host);
		if (!isFollowUrl(url, currentOrigin(host))) return "refused";
		raw.set(FOLLOW_KEYS.target, {
			url,
			at: now
		});
		if (alive(leaderOf(host), now)) return "moved";
		const opened = raw.get(FOLLOW_KEYS.opened, 0);
		if (typeof opened === "number" && now - opened < followTiming.openCooldownMs) return "moved";
		raw.set(FOLLOW_KEYS.opened, now);
		host.openTab(url, { background: true });
		return "opened";
	}
	function installFollowMenu(host, alert, onToggle = () => {}) {
		let id;
		const draw = () => {
			if (id !== void 0) host.unmenu(id);
			id = host.menu(`RizzBot tab follows the chat I open: ${followEnabled(host) ? "on" : "off"}`, () => {
				const on = !followEnabled(host);
				setFollow(host, on);
				draw();
				onToggle(on);
				alert(on ? "On. Open a chat on Tinder and a RizzBot tab moves to her page (girls already in RizzBot). Keep one RizzBot tab open, ideally in its own window beside Tinder; if none is open, one opens behind your tab." : "Off. RizzBot tabs stay where they are.");
			});
		};
		draw();
	}
	function runFollower(host, win, clock = () => Date.now()) {
		const origin = win.location.origin;
		const noop = {
			start() {},
			stop() {}
		};
		if (!isAllowedOrigin(origin) || origin !== currentOrigin(host)) return noop;
		const raw = rawHost(host);
		const me = Math.random().toString(36).slice(2) + clock().toString(36);
		let timer = null;
		let seq = 0;
		const claim = () => raw.set(FOLLOW_KEYS.leader, {
			id: me,
			at: clock()
		});
		const leading = () => leaderOf(host)?.id === me;
		const go = (t) => {
			if (!followEnabled(host) || !leading()) return;
			const target = t;
			if (!target || typeof target.url !== "string" || typeof target.at !== "number") return;
			if (clock() - target.at > followTiming.freshMs) return;
			if (!isFollowUrl(target.url, origin)) return;
			const u = new URL(target.url);
			if (win.location.pathname + win.location.search === u.pathname + u.search) return;
			const id = `${me}-${++seq}`;
			let done = false;
			const onMsg = (e) => {
				const d = e.data;
				if (e.source === win && e.origin === origin && d?.type === FOLLOW_MSG.navigated && d.id === id) done = true;
			};
			win.addEventListener("message", onMsg);
			win.postMessage({
				type: FOLLOW_MSG.navigate,
				path: u.pathname + u.search,
				id
			}, origin);
			win.setTimeout(() => {
				win.removeEventListener("message", onMsg);
				if (!done) win.location.assign(target.url);
			}, followTiming.ackMs);
		};
		const start = () => {
			if (timer !== null) return;
			if (!alive(leaderOf(host), clock()) || win.document.visibilityState === "visible") claim();
			go(raw.get(FOLLOW_KEYS.target, null));
			timer = win.setInterval(() => {
				if (leading()) claim();
				else if (!alive(leaderOf(host), clock())) {
					claim();
					go(raw.get(FOLLOW_KEYS.target, null));
				}
			}, followTiming.beatMs);
		};
		const stop = () => {
			if (timer !== null) win.clearInterval(timer);
			timer = null;
			if (leading()) raw.del(FOLLOW_KEYS.leader);
		};
		const onFocus = () => {
			if (timer !== null) claim();
		};
		raw.onChange(FOLLOW_KEYS.target, go);
		raw.onChange(FOLLOW_KEYS.on, (v) => v === true ? start() : stop());
		win.addEventListener("focus", onFocus);
		win.document.addEventListener("visibilitychange", () => {
			if (win.document.visibilityState === "visible") onFocus();
		});
		win.addEventListener("pagehide", () => {
			if (leading()) raw.del(FOLLOW_KEYS.leader);
		});
		if (followEnabled(host)) start();
		return {
			start,
			stop
		};
	}
	var site_default$1 = {
		id: "instagram",
		name: "Instagram",
		matches: ["https://www.instagram.com/*"],
		description: "Instagram: add her from her profile, with your chat. Reads only what you can see; never likes, follows or views a story.",
		storage: "ig.",
		network: ["client.ts", "hook.ts"]
	};
	var site_default = {
		id: "tinder",
		name: "Tinder",
		matches: ["https://tinder.com/*"],
		description: "Tinder: a status badge on every match and chat, chats synced by themselves, and one-press import. Reads only what Tinder already loaded; never sends Tinder a request or presses its buttons.",
		storage: "tinder.",
		network: ["hook.ts"],
		requests: "none",
		testUrls: ["https://tinder.com/app/messages/5f00000000000000000000a15f00000000000000000000b2"]
	};
	var LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAQ1UlEQVR42u1ba4xdV3X+vrX3ua/xeMaJ7UASZDDkQRxoIKFNSxsnSKUI0pSHZkppeAWKQCAhaEUrQTMeUaE+1KqVqtLQiipQaPDQCkppeRSZASkqNFbigCcvO9CYmBnb87537uOcvVZ/7HPuvbbTZK494/4gWzq6c88999yzvr32+r611h7g2fHs+JkeXO+FhjGHsUFuPXZuT3TicHymnXsMU2NK0H6mZ8jG9jsb2+826/7+6WcdJGBHr33VJTt42Z+6ZKRkVIU5OhELMFISM5JQAU3ibIlE51LAxAFMAJCEWAApTgxwACT+kBAKBzFRFZnPzB/NvD34hMcDnBpfjs9ixMQ+cnJSL9gSMEAI6LHrbrrislV5lFuvAlw1fgIBKACS+EoBjPkti8NFCLuf+/heCuPPOMQB9AAEwTJ0zJ4MkG+2NPvMjnvffaDwCE6NhwsKwOwNr9u9df7UDwS+LFuvNLoKTeOcwhysMBSEMRpDRMNNBAYBCyMpAF0EBwDgYBAYCNIB8AYKlHRllihSRtAMbdg3mkl25/Zvv+t7FpHGRsQHWRdKtkbAObHUhfoRJ5o6cYkj6ShwwuAIdYQ5IZwIHAkHwgnghHAUOhE6AR1h+bV07F5PRxQIwNPAtmbWSOuhqR2rsfTq4azy3ZWbPjNBIwjaBCbkggAAlAFanCFtI208Blgzd2WD0aLTkyAsjx65U8DiKmBxPn+Fwqz4O19NtNwn43ma0ZFOSNZDM2Sa+mEO7Vv5lbu/dN+td9UmMal2niCs68ut/NkAA+FgWRPZ6mOAtkG66O6SP3ifUdD8vSmgGl+h+bqLIMByIKxYkwohIGQEzgCawREOZqh3VtJhDt125VLtK/fdelcNE3mA3FwP6A8XBoEA2RrC6qM5CBKNgXZnHJIDYdFIQmHoGSpmYA4O8yMCFEEzGCx/7QGrJJDU09V0WGqvetF8+TOcnFSMTcnmA8Az3zogrSNbfTgHgQA1TlnuyRSCIjknsM+9I5OxIAvLl4FZ9BQNQAj5csqXFot1ApBIGmk9HXFb33TylZ/+PU6Nh3PVCgMg1wu4agaDAnSwtIF09RFoWINpCrM2zNpA6MS/tRPPhzaQdWChDQsdqKUw64AhBS0FQgtAgHgPeh+9SrWIBdEPujECgJnvZPUwZKWPP7n3H67G1JjaxODxwK/nogoQ3dHiaivWrDGKGMnWMD/7PTTaHTiJeoAQSFfs5JrA4vsYN0rRi/JzMAeRCnx5K0pbdiAZuQSS1ICgEeyC9CwnQBhTBAyxWml2Wp8g+Mb4dJMbD0ALwHAxC2bRNXN3NA2AeGhI0UkbcBIVoUCMEMCiBiBzI9XB6ACkEQC4+BjmoUgZmg22F2chcz9GdcfzUduxCxpRj8YzhuL8lGtkDa1J6baf/NKnruMkH7CJCRlELa7TZdq9YFRIXRoMIQ9sCpIwiUKnTMcqnVQgUqGTCpyU4aQKF9/TSYWUcv55lV6q4qVERzoX4BO1tI36scNYfvwQaAXNnh2OFKoVVt1Q8HcAAGb2cMM9AK3TY4D1ZwqQOBuR2QExtNV+mtEatOKZGUmBgEIhcNGL1EDJGYJBLNj2rZYMGwR1qkpSkc7SLFZ+9CCGd//caUwEMFeilKAdCPm6A3snPsKp8VaRw2wcABXAGjk1UUBoNNYAwqAUKBUAQkno5nx4//9sr3x192LVnxja8Yy6fS5tcihs4xVVXJQuhl+upPah0VD6hWXLlElZOss/RXNuGNVLr4aFrOcKkXKlramVxL3gqvS51wK4DxNGTHIDAUCx9gygQk0LtotpkfUEEI0oqXbGZ2Y6BqTrnYl8PAngC2Nj+7/4F9/6578a7ZTev2JBxZeldeIYyqOXgpUtUNU8ruTqwixUpOITa78cwH349j7pcu1GAWCFQMnXY3FWDZDTIoRBzSQnLGfAgJnbXoep8UDiA08Mv3nXRaF06wotIOu49sJxVC67GrQQGcgsgsAoopzZlZuoA/rAKCgxt7JQbSzOh1CEBePAx3QGjIkZuFyzj7QEbQcIxVlaXwSyDgiC0BhHovcRBnjzz+lWkzYSgHYrN5K5X/VbV8QCsi88e5zPIKYCMMGXzH7hoU7iDg5LmRBvlraBrN1neJ5v5PJQwPKmeUCu5KPxuQAqAnJ3eeQnzs/8Yswwx/WIE4FQFKYwzXqy2ew0oapAuikAlPNsUPtcv0hle2YPVGNdd9yl2hDzhIBk/vsaBZhq1AgWI36K7NRphdUNWwL93H9aLOjj/yKZNUMb2Xnbvg/X2F3XX5+Yk+s6MBBKis9rEqHIDgEL+aEw1SObkgtECHoBsBAiMSWyXJnn9VAS7jwLVYb3eGIyfez4W399BP6Fa8yUMPGVGkQSWNC88NqF3WXaRpvhfgCYGiAIrhOAMgzN3AGsq/xo7OYHXZ1udhbv2WmeNvG06x7YJsSn0u9c984d2+fw58ZgdITBwW0Zzf1NCxkEgFqCkzVrH1+s6f0AMDY1rhvvAab5jOcBiPmsm56hFgh39lruu+gZs7VwfM+7Xjy0mP1jDe6Fq2JKNXGlKpLaKMxC/O1iMlTV+6qYpV+/dvoD9UGrxgMIoT4mAPMcXbs5gRYxgUDo3dbuvfHG6u4FfwWYWWpGIAFQyj8uIcnjtpYriWjpeeXgfq202ry9EpItK5qq0IsaUB7ZCYqDhhCzSUYWIEw61kKd6d9veGPkLCXYFwz7GUif4lwx8w/9eHFP2de+X65ULCgoNAAZYAIgA/M+ANuBlXwdtTSgYVAnTkLIUBraCVeuQbN2fGQG5GlV2OKH3KKuff3y+z94r2FCBu0ZyKDhyUzjkfuDWiGRe/GhH9aS96zXl9lurkmZQlGlU6Mz0JvSmdLBaGpoZp3QDJ1MaSY0AQ2loe1wQyPQLAM1AJaCpjAL5s3Q0lbaSPD7BDA1NsPN8wADlL2KUJEMQRUqgtMS9r7RIc0TtrS6DHEelaSKoEW+GkWtAaBo3jLK3SipoOS3ga4GDSkoSVxfXfXJrJJUk1Ou8bHnff/Dh861YyTrB0DzCrf11F+XEXrSlCZA1tMBSRr7QQrj4soSUw10ZN4qIAkh6UiWQVcFXA1MRuGSEYA+Kj+zXPLGoilV06FkKFlEff+Ogx/+4/Nplw0mhbtKMNbyVbV7TotS9hliiTCaAgJaCBnml+aRwfJWWcxjYn+xDEMJlFJePssATXOyi4LH4g9nVTeUrNrav/7nFStvNUwIBqC98/SAeJyVGRZdgS4znNlai9cJBWmaYn5pPhdORQ0hRGMtL4lrFqUuAswCVDM1y7KKQaqu5FfQ+OTXrvyvN/7m1GQH2GcD1hwGjwGrrSaH+zo+Zr1XNQNVo5vmJbJ+XGODq1glsanSaTcxvzSP7SM7obnRhIMhg5nAIAoEMxGjpVKVioBl6VAfr7vmRy9+8M577AfgGIzn2yCVQYIg+lpYvf4A+jKB/rwg7/06esfYGYwhD3Di0GiuYHF1Hq74lgUQGYQBVaFUnXNVKfmK89IUfbQh7T+YKS9cf/GDd95jGHMb1R0eoCRmueizruGF0XZGyTTLxbAB/KHoya1Ey5PlnP0JAxLxWFlbRiIlDNe2I5hCoAhI0zW6o0aeMNj3Q7n2jXsvb33ntV/7s/Zm7A8YgAYt7/71hbnT8vFCGUj3todxTfKSY4ePzmy/4p0Xmf2TqWZGuijiCU+HpfoCRBLUKtsMmpl3Pnui1P7dFz302X/v3vuHwIG9E/7m6X2BU9ww4wdjAbOiFlyUoWAGhIIBrIdJ8YR7MBMMcNeceuyeee8+OizOm1noVVIMQmJp5STanQaVILO0elnb7n7i6tuvJYAfXjNWAsBbpiezzdgwNQAAgKohqEYwrLdPwwConE2B+RIJBwC/59Rjn5ijfXqU4gNCZqeVUAyLy3PQtM3UVCvBtu9sZ1+eedkdl147M9UxTBCbNJ4WgH1nVESsr7er6PG+sWheEvoUj3ozEPYD7ru7t713XvCtraRXIBTdC1JgmmFhZRammTStE8pqu5+3uPalB156+xAwabbR5aZzrgqz1yOwoiRihtNnNCrBqb7S1mHA3nvwYHp0S3l8VeThYfK0kjlFkIYOFlZmAVPX1HY2pHzF7pVwz76JCQJjshkgrA+AMqBF3brI/ih5YLQ8MsRlEczU8ey1OgnoFwD3mp/MLMwPude3nDtVAp0WzGlxK1UnXcPSygkQ8M3QSocDbv3g3Y/cFSvFe91GgzDQBom4R6O/DoDcA0J3w4snJAiTp7rFOBAOYK//+eOPPHKyXBmHIE2gpuzRiYhDM61juX4CIkyaoZltC/LuxV1vnow9g73uwgPQbudJSbGfJ+YDWuz0AGGGUAP9KnB0rVw+aAAPP4VEvQXT2QHA3zB36MCSd79ToXNiGgLMyLizxtGh0VrB6toCKOKaWTMbVX/n7K63vJeYzgwT/oICEGOgQhG6tQCFQtUAJTKFlkiXCmdb1S2vfc3xo8cAcPL/6M/dAmSGvf7ahYfvnheZHKHzZhoszzJpBk+i3lhAs7lECF07bYRtmf3N7PPf8hvEZHYAe/0Fp8GuGjbCNG5uzAD1MMmI1cVK6babjj/86H7A8Rmak8R0MOz1L15+aN8JZ5/dRvEKy9hXdxISy2vzSDtrDKRY1sa2zD5/bNfbb4yedP4gDMQC1u34xZnKzMzDQLKzWi2/6Vdnf/TfBwA/vr6GqAHTYT/gDl320nfPO0yPgF5hGfpBALHcOAENLQbCGLLaxSH90pHdv3XFLZjO9ud5wYWhQevVBzXu7jGhyGIiv/2Lx4588wDgb8H6uyIEbAyw8Zmpzk93VsdWPR+rQbzBAoFur8EsYKl+AgippBZCNeglz03dVx7YffvOcUyF89ksue4vhrwZqgQCYISFIRGZ9/K+lz/5oy/eBySDGN9fON0PuJuOPHByoYbXtx0WPSAKUxaVfxBBMyw25kBV19Q0qwW76gVt/Mu9N36oCkziXOlx/elwTn5xV5CFLSJ+zskfvuL4439rgL/hHBqTZ9Ljy2dnZuYr/s0UqANMSYNEyU0KUu1gqXECJH09a2dbTV55zfFTn4tV+XMTSutngVz0wCwbofiTxF9ef/zxPzoAeA68CeKpmCEGtZedPPSNxSR5X9U5J2ZBzUDGspiIoB2aWFo7CS/ON0IrHQnyhsXL3/rXhVAatEO7Th0QQ3owDSMiyZzwc9fN/vhDBrib89WxEZR0C6YjPS4e+rtTnp8YEfFqlnXrD2agCJqdFay05iHCpJ61stHMvf/U5W/7WNQIgwmldW+TC4ZslOKWhF/98lW73pH3+5QbZHw/PR7AXn/14qGPzjn7/CidN4vMUFSfKQ6N1iIareUolEIru0jl4yd2veOOQYXS+gCo+awiMrQg+F7r0ovH901Ph309dbzRw27GdDBAju649I6lBN/dSu8V1iEsAyyDWUZKttqaz9qdeoCItdJ2Z6SNTz6x6+2vISaz9TLDui5yzc7WJt2hR2ujt91w8ODa06m8jfGCCOxrj3yt/fhF5bG6s8cvoS8Nw/tRJn4bnB+l89uYeGku+XKnlVTpSiXV0uVt/Mfc89/26phCPzMIz/QvMyRg/7brmueknskbjh4+VvwbDS7A2I8xN46pcP8lr9hz0Vr2vraZgj7nBABwCBb/kePiLZdRA3XYlfyCw5NfuaT2J+85+KlsQ710s4oS/5+/yUEeYpPW/Hp+X76NvU/rzjcDAHYacILAzUpMKp4dz45nxzON/wVjCeWnFdr1MwAAAABJRU5ErkJggg==";
	function fixedStyle(p) {
		const edges = p.top !== void 0 || p.right !== void 0 || p.bottom !== void 0 || p.left !== void 0 ? p : {
			top: "20px",
			right: "24px"
		};
		let s = "position:fixed";
		for (const k of [
			"top",
			"right",
			"bottom",
			"left"
		]) if (edges[k] !== void 0) s += `;${k}:${edges[k]}`;
		return `${s};z-index:2147483647`;
	}
	var CSS$1 = `
:host { all: initial; }
.wrap, .bwrap {
  --rose: #f43f5e; --pink: #ec4899; --ok: #22c55e; --warn: #f59e0b; --err: #ef4444;
  --surface: #0e0e11; --line: #222228; --tile: #16161a; --field: #070709; --ghost: #19191e;
  --text: #f4f4f6; --muted: #9a9aa3; --faint: #77777f;
  font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text); -webkit-font-smoothing: antialiased;
}
* { box-sizing: border-box; }

/* ---------------- the badge ---------------- */
.pill {
  display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 15px 0 5px; border: 0; border-radius: 999px;
  background: linear-gradient(100deg, var(--rose) 0%, var(--pink) 100%); color: #fff;
  font: inherit; font-size: 14px; font-weight: 650; white-space: nowrap; cursor: pointer;
  /* a plain drop shadow, no glow; hover only brightens (owner: never a lift, no more glow) */
  box-shadow: 0 2px 8px rgb(0 0 0 / .35), inset 0 1px 0 rgb(255 255 255 / .16);
  transition: filter .15s, transform .12s;
}
.pill:hover:not(:disabled) { filter: brightness(1.06); }
.pill:active:not(:disabled) { transform: scale(.97); }
.pill:disabled { opacity: .9; cursor: default; }
.pill:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.bwrap.inline .pill { height: 34px; font-size: 13.5px; box-shadow: inset 0 1px 0 rgb(255 255 255 / .16); }
.disc { width: 27px; height: 27px; border-radius: 50%; background: #0a0a0c; display: grid; place-items: center; flex: none; }
.disc img { width: 17px; height: 17px; display: block; }
.disc .spin { width: 15px; height: 15px; border-color: rgb(244 63 94 / .3); border-top-color: var(--rose); }
/* already in RizzBot: a green tail holds the tick (owner's pick 5, 2026-10-02) */
.pill.done { padding-right: 0; overflow: hidden; }
.tail { align-self: stretch; display: grid; place-items: center; width: 34px; margin-left: 4px; background: linear-gradient(100deg, #34d399, #4ade80); color: #052e16; flex: none; }
.tail svg { width: 14px; height: 14px; display: block; }
/* no entrance animation: the badge is redrawn on every state refresh (several at
   startup, and after each site re-render), so any animation here replays */

/* ---------------- the modal ---------------- */
.wrap { position: fixed; inset: 0; z-index: 2147483647; display: none; place-items: center; padding: 16px; background: rgb(0 0 0 / .7); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
.wrap.open { display: grid; animation: fade .18s ease-out both; }
.wrap.open.steady { animation: none; }
@keyframes fade { from { opacity: 0; } }
.mod { position: relative; width: 100%; max-width: 360px; max-height: calc(100vh - 32px); overflow: auto; border-radius: 20px; background: var(--surface); border: 1px solid var(--line); box-shadow: 0 24px 64px rgb(0 0 0 / .6); padding: 28px 22px 22px; text-align: center; animation: rise .22s ease-out both; }
.steady .mod { animation: none; }
@keyframes rise { from { opacity: 0; transform: translateY(6px) scale(.99); } }
.x { position: absolute; top: 12px; right: 12px; width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; color: var(--faint); background: none; border: 0; cursor: pointer; transition: background .15s, color .15s; }
.x:hover { background: #1a1a1f; color: #fff; }
.x svg { width: 16px; height: 16px; }
.mark { position: relative; width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 15px; background: var(--tile); display: grid; place-items: center; }
.mark img { width: 30px; height: 30px; display: block; }
.mark.working img { animation: breathe 1.6s ease-in-out infinite; }
@keyframes breathe { 50% { transform: scale(.9); opacity: .75; } }
.st { position: absolute; right: -5px; bottom: -5px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; border: 3px solid var(--surface); animation: soft .25s .1s ease-out both; }
.st svg { width: 11px; height: 11px; }
.st.ok { background: var(--ok); color: #052e16; }
.st.warn { background: var(--warn); color: #2b1702; }
.st.error { background: var(--err); color: #fff; }
/* a quiet arrival: a short fade with a hint of scale, no bounce */
@keyframes soft { from { opacity: 0; transform: scale(.85); } }
h3 { margin: 0; font-size: 19px; line-height: 1.3; font-weight: 700; text-wrap: balance; }
p { margin: 6px auto 0; color: var(--muted); max-width: 30ch; }
.content { margin-top: 20px; display: grid; gap: 12px; text-align: left; }
input { width: 100%; height: 44px; border-radius: 12px; border: 1px solid #2a2a31; background: var(--field); color: #fff; font: inherit; font-size: 15px; font-weight: 500; padding: 0 14px; outline: none; transition: border-color .15s, box-shadow .15s; }
input:focus { border-color: var(--rose); box-shadow: 0 0 0 4px rgb(244 63 94 / .15); }
.bar { height: 6px; border-radius: 999px; background: #1c1c21; overflow: hidden; }
.fill { position: relative; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--rose), var(--pink)); overflow: hidden; transition: width .5s ease; }
.fill::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgb(255 255 255 / .35), transparent); transform: translateX(-100%); animation: sheen 1.5s ease-in-out infinite; }
@keyframes sheen { to { transform: translateX(100%); } }
.stepline { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; color: #8a8a93; }
.stepline span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.stepline span:last-child { font-variant-numeric: tabular-nums; flex: none; }
.list { display: grid; gap: 2px; padding: 4px; border-radius: 14px; background: #121216; }
.row { display: flex; align-items: center; gap: 11px; padding: 10px 12px; font-size: 14px; line-height: 1.3; font-weight: 500; color: #d4d4da; }
.row.running { color: #fff; }
.row .ic { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; flex: none; }
.row .ic svg { width: 11px; height: 11px; }
.row .ic.done { background: rgb(34 197 94 / .15); color: var(--ok); }
.row .ic.failed { background: rgb(245 158 11 / .15); color: var(--warn); }
.row .ic.skipped { background: #1c1c21; color: #8a8a93; }
.row.skipped { color: #8a8a93; }
/* a running step pings (it carries on in RizzBot), it does not spin: a spinner
   reads as "wait here" (owner) */
.row .ping { position: relative; width: 20px; height: 20px; flex: none; display: grid; place-items: center; }
.row .ping::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--rose); }
.row .ping::after { content: ""; position: absolute; left: 6px; top: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--rose); animation: ping 1.8s ease-out infinite; }
@keyframes ping { to { transform: scale(2.6); opacity: 0; } }
.row .r { margin-left: auto; color: #8a8a93; font-size: 13px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.portrait { position: relative; width: 96px; height: 96px; margin: 0 auto 14px; }
.portrait .face { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; display: grid; place-items: center; background: #1c1c21; color: #c7c7cf; font-size: 34px; font-weight: 700; box-shadow: 0 0 0 3px var(--surface), 0 0 0 5px #2a2a31; }
.portrait .corner { position: absolute; right: -6px; bottom: -2px; width: 38px; height: 38px; border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 3px var(--surface); background: #1c1c21; }
.meta { display: flex; justify-content: center; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 6px; color: #8a8a93; font-size: 12.5px; font-weight: 500; }
.meta i { width: 3px; height: 3px; border-radius: 50%; background: #55555d; }
.meta + p { font-size: 12.5px; color: #7d7d86; margin-top: 2px; }
a.tlink { display: inline-flex; align-items: center; gap: 5px; margin-top: 8px; color: #f9a8d4; font-size: 13px; font-weight: 600; text-decoration: none; }
a.tlink:hover { color: #fbcfe8; text-decoration: underline; text-underline-offset: 3px; }
a.tlink svg { width: 13px; height: 13px; }
.count { text-align: center; padding: 2px 0 32px; font-size: 40px; line-height: 1; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; animation: fadein .3s .08s ease-out both; }
.count small { display: block; margin-top: 10px; font-size: 13px; line-height: 1.2; font-weight: 500; color: #8a8a93; letter-spacing: 0; }
@keyframes fadein { from { opacity: 0; } }
.btns { display: grid; gap: 8px; }
.btn { height: 46px; border-radius: 13px; border: 0; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 14px; font: inherit; font-size: 15px; font-weight: 650; color: #fff; cursor: pointer; text-decoration: none; white-space: nowrap; background: var(--ghost); transition: filter .15s, background .15s, transform .12s; }
.btn:hover { background: #222228; }
.btn:active { transform: scale(.98); }
.btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.btn svg { width: 17px; height: 17px; flex: none; }
.btn.rose { background: linear-gradient(100deg, var(--rose), var(--pink)); }
.btn.blue { background: linear-gradient(100deg, #3b82f6, #6366f1); }
.btn.rose:hover, .btn.blue:hover { filter: brightness(1.07); }
.btn.quiet { height: 34px; background: none; color: #8a8a93; font-size: 13.5px; }
.btn.quiet:hover { color: #fff; background: none; }
.btn:disabled, .btn:disabled:hover { cursor: default; opacity: .6; color: #8a8a93; transform: none; }
.spin { width: 16px; height: 16px; border: 2px solid rgb(255 255 255 / .2); border-top-color: #fff; border-radius: 50%; animation: s .8s linear infinite; }
@keyframes s { to { transform: rotate(360deg); } }
`;
	var SVG = {
		check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
		ok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
		warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M12 7v6M12 17h.01"/></svg>`,
		error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
		dash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M6 12h12"/></svg>`,
		x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
		sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
		open: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
		link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
		retry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
		plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
		user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`
	};
	function cardSignature(state) {
		return signatureOf({
			...state,
			progress: void 0
		});
	}
	var Panel = class {
		doc;
		wrap = null;
		dismissed = false;
		state = { kind: "hidden" };
		lastProgress = 0;
		badgeHost = null;
		badgeWrap = null;
		placement = () => ({ kind: "fixed" });
		timer = null;
		onKey = null;
		badgeSig = "";
		pillClick;
		cardSig = "";
		live = null;
		constructor(doc) {
			this.doc = doc;
		}
		setPlacement(fn) {
			this.placement = fn;
			this.placeBadge();
		}
		shadowWrap(tag, cls) {
			const host = this.doc.createElement(tag);
			const root = closedShadow(host);
			const style = this.doc.createElement("style");
			style.textContent = CSS$1;
			root.appendChild(style);
			const wrap = this.doc.createElement("div");
			wrap.className = cls;
			root.appendChild(wrap);
			return {
				host,
				wrap
			};
		}
		mount() {
			if (this.wrap?.isConnected) return this.wrap;
			const parent = this.doc.body ?? this.doc.documentElement;
			if (!parent) return null;
			const { host, wrap } = this.shadowWrap("rizzbot-connect", "wrap");
			parent.appendChild(host);
			let downOnTint = false;
			wrap.addEventListener("pointerdown", (e) => {
				downOnTint = e.target === wrap;
			});
			wrap.addEventListener("click", (e) => {
				if (e.target === wrap && downOnTint) this.close();
				downOnTint = false;
			});
			this.wrap = wrap;
			return wrap;
		}
		badgeMount() {
			if (this.badgeWrap && this.badgeHost) return this.badgeWrap;
			if (!this.doc.body) return null;
			const { host, wrap } = this.shadowWrap("rizzbot-connect-badge", "bwrap");
			this.badgeHost = host;
			this.badgeWrap = wrap;
			const win = this.doc.defaultView;
			if (win && this.timer === null) this.timer = win.setInterval(() => this.placeBadge(), 700);
			return wrap;
		}
		placeBadge() {
			const host = this.badgeHost;
			const wrap = this.badgeWrap;
			if (!host || !wrap) return;
			if (this.state.kind !== "pill") {
				if (host.isConnected) host.remove();
				return;
			}
			const p = this.placement();
			const parent = p.kind === "before" ? p.node.parentElement : this.doc.body;
			if (!parent) return;
			if (p.kind === "before") {
				if (host.parentElement !== parent || host.nextElementSibling !== p.node) parent.insertBefore(host, p.node);
			} else if (host.parentElement !== parent) parent.appendChild(host);
			const style = p.kind === "before" ? "display:inline-flex;align-items:center;align-self:center;flex:none;margin-right:8px;position:static" : fixedStyle(p);
			if (host.getAttribute("style") !== style) host.setAttribute("style", style);
			wrap.classList.toggle("inline", p.kind === "before");
		}
		isWorking() {
			return this.state.kind === "card" && (this.state.icon === "spin" || !!this.state.keep) && !this.dismissed;
		}
		show(state) {
			this.dismissed = false;
			this.render(state);
		}
		close() {
			if (this.state.kind !== "card" || !this.state.onClose || this.dismissed) return false;
			const onClose = this.state.onClose;
			this.dismissed = true;
			this.render(this.state);
			onClose();
			return true;
		}
		listenForEscape(on) {
			const win = this.doc.defaultView;
			if (!win) return;
			if (on && !this.onKey) {
				this.onKey = (e) => {
					if (e.key === "Escape" && this.close()) {
						e.preventDefault();
						e.stopPropagation();
					}
				};
				win.addEventListener("keydown", this.onKey, true);
			} else if (!on && this.onKey) {
				win.removeEventListener("keydown", this.onKey, true);
				this.onKey = null;
			}
		}
		render(state) {
			const steady = this.state.kind === "card" && state.kind === "card" && !this.dismissed;
			if (state.kind === "card" && steady && state.progress && this.live?.fill.isConnected) {
				if (cardSignature(state) === this.cardSig) {
					this.state = state;
					const target = Math.max(.02, Math.min(1, state.progress.value));
					this.live.fill.style.width = `${Math.round(target * 100)}%`;
					this.live.step.textContent = state.progress.step;
					this.live.pct.textContent = `${Math.round(Math.min(1, state.progress.value) * 100)}%`;
					this.lastProgress = target;
					return;
				}
			}
			this.live = null;
			this.cardSig = state.kind === "card" ? cardSignature(state) : "";
			const continuing = steady && this.state.kind === "card" && (!!this.state.progress || !!this.state.keep);
			if (state.kind !== "card") this.dismissed = false;
			this.state = state;
			const wrap = this.mount();
			if (!wrap) return;
			wrap.replaceChildren();
			const el = (tag, cls, text) => {
				const n = this.doc.createElement(tag);
				if (cls) n.className = cls;
				if (text !== void 0) n.textContent = text;
				return n;
			};
			const logo = () => {
				const i = el("img");
				i.src = LOGO;
				i.alt = "";
				return i;
			};
			const glyph = (n, icon) => {
				if (icon) n.insertAdjacentHTML("afterbegin", SVG[icon]);
			};
			const showing = state.kind === "card" && !this.dismissed;
			wrap.classList.toggle("open", showing);
			wrap.classList.toggle("steady", showing && steady);
			this.listenForEscape(showing && state.kind === "card" && !!state.onClose);
			if (state.kind === "pill") {
				const bw = this.badgeMount();
				if (!bw) return;
				this.pillClick = state.onClick;
				const sig = signatureOf([
					state.label,
					!!state.ok,
					!!state.busy,
					!!state.disabled || !state.onClick,
					state.title ?? ""
				]);
				if (sig === this.badgeSig && bw.firstChild) {
					this.placeBadge();
					return;
				}
				this.badgeSig = sig;
				bw.replaceChildren();
				const b = el("button", state.ok ? "pill done" : "pill");
				const disc = el("span", "disc");
				disc.appendChild(state.busy ? el("span", "spin") : logo());
				b.appendChild(disc);
				b.appendChild(el("span", void 0, state.label));
				if (state.ok) {
					const c = el("span", "tail");
					c.innerHTML = SVG.ok;
					b.appendChild(c);
				}
				if (state.title) b.title = state.title;
				b.disabled = !!state.disabled || !!state.busy || !state.onClick;
				b.addEventListener("click", (e) => {
					e.stopPropagation();
					this.pillClick?.();
				});
				bw.appendChild(b);
				this.placeBadge();
				return;
			}
			this.placeBadge();
			if (state.kind === "hidden" || this.dismissed) return;
			const mod = el("div", "mod");
			mod.setAttribute("role", "dialog");
			mod.setAttribute("aria-label", state.title);
			if (state.onClose) {
				const x = el("button", "x");
				x.setAttribute("aria-label", "Close");
				x.innerHTML = SVG.x;
				x.addEventListener("click", () => this.close());
				mod.appendChild(x);
			}
			if (state.portrait) {
				const pr = el("div", "portrait");
				const face = (src, cls, initial) => {
					if (src) {
						const i = el("img", cls);
						i.src = src;
						i.alt = "";
						return i;
					}
					return el("div", cls, initial ?? "");
				};
				pr.appendChild(face(state.portrait.picture, "face", state.portrait.initial));
				if (state.portrait.corner) pr.appendChild(face(state.portrait.corner, "corner"));
				mod.appendChild(pr);
			} else {
				const icon = state.icon ?? "dot";
				const mark = el("div", `mark${icon === "spin" ? " working" : ""}`);
				mark.appendChild(logo());
				if (icon === "ok" || icon === "warn" || icon === "error") {
					const st = el("span", `st ${icon}`);
					st.innerHTML = SVG[icon];
					mark.appendChild(st);
				}
				mod.appendChild(mark);
			}
			mod.appendChild(el("h3", void 0, state.title));
			if (state.meta?.length) {
				const m = el("div", "meta");
				state.meta.forEach((t, k) => {
					if (k) m.appendChild(el("i"));
					m.appendChild(el("span", void 0, t));
				});
				mod.appendChild(m);
			}
			for (const t of state.text ?? []) mod.appendChild(el("p", void 0, t.charAt(0).toUpperCase() + t.slice(1)));
			if (state.textLink) {
				const a = el("a", "tlink", state.textLink.label);
				a.insertAdjacentHTML("beforeend", SVG.open);
				a.href = state.textLink.href;
				a.target = "_blank";
				a.rel = "noopener";
				mod.appendChild(a);
			}
			const content = el("div", "content");
			let input = null;
			if (state.input) {
				input = el("input");
				input.type = "text";
				input.value = state.input.value;
				input.placeholder = state.input.placeholder ?? "";
				input.setAttribute("aria-label", state.input.label);
				input.maxLength = 40;
				input.spellcheck = false;
				for (const t of [
					"keydown",
					"keyup",
					"keypress"
				]) input.addEventListener(t, (e) => e.stopPropagation());
				content.appendChild(input);
			}
			let slide = null;
			if (!continuing) this.lastProgress = .02;
			if (state.progress) {
				const bar = el("div", "bar");
				const fill = el("div", "fill");
				const target = Math.max(.02, Math.min(1, state.progress.value));
				fill.style.width = `${Math.round(this.lastProgress * 100)}%`;
				slide = {
					fill,
					to: target
				};
				this.lastProgress = target;
				bar.appendChild(fill);
				content.appendChild(bar);
				const step = el("div", "stepline");
				const stepText = el("span", void 0, state.progress.step);
				const pct = el("span", void 0, `${Math.round(Math.min(1, state.progress.value) * 100)}%`);
				step.appendChild(stepText);
				step.appendChild(pct);
				content.appendChild(step);
				this.live = {
					fill,
					step: stepText,
					pct
				};
			}
			if (state.checklist?.length) {
				const list = el("div", "list");
				for (const item of state.checklist) {
					const row = el("div", `row ${item.state}`);
					if (item.state === "running") row.appendChild(el("span", "ping"));
					else {
						const ic = el("span", `ic ${item.state}`);
						ic.innerHTML = SVG[item.state === "done" ? "ok" : item.state === "skipped" ? "dash" : "warn"];
						row.appendChild(ic);
					}
					row.appendChild(el("span", void 0, item.label));
					if (item.detail) row.appendChild(el("span", "r", item.detail));
					list.appendChild(row);
				}
				content.appendChild(list);
			}
			if (state.count) {
				const c = el("div", "count", String(state.count.value));
				c.appendChild(el("small", void 0, state.count.label));
				content.appendChild(c);
			}
			const buttons = state.buttons ?? [];
			if (buttons.length || state.link) {
				const row = el("div", "btns");
				let link = null;
				if (state.link) {
					link = el("a", `btn ${state.link.ghost ? "" : "rose"}`, state.link.label);
					glyph(link, state.link.icon);
					link.href = state.link.href;
					link.target = "_blank";
					link.rel = "noopener";
					if (state.link.first) row.appendChild(link);
				}
				buttons.forEach((btn, i) => {
					const b = el("button", `btn${btn.blue ? " blue" : btn.primary ? " rose" : btn.quiet ? " quiet" : ""}`, btn.label);
					glyph(b, btn.icon);
					b.disabled = !!btn.disabled;
					b.addEventListener("click", () => {
						const now = this.state.kind === "card" ? this.state.buttons?.[i] : void 0;
						if (now && !now.disabled) now.onClick(input?.value ?? "");
					});
					row.appendChild(b);
				});
				if (link && !state.link?.first) row.appendChild(link);
				content.appendChild(row);
			}
			if (content.childElementCount) mod.appendChild(content);
			wrap.appendChild(mod);
			if (slide) {
				slide.fill.offsetWidth;
				slide.fill.style.width = `${Math.round(slide.to * 100)}%`;
			}
			if (input) {
				const primary = buttons.find((b) => b.primary);
				const field = input;
				if (primary) field.addEventListener("keydown", (e) => e.key === "Enter" && primary.onClick(field.value));
				field.focus();
				field.select();
			}
		}
	};
	var PAYLOAD_MARK = "__rizzbot_instagram__";
	var isObj$3 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
	var arr$1 = (v) => Array.isArray(v) ? v : [];
	var str$2 = (v, max = 4e3) => typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
	var num = (v) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : null;
	var get = (o, ...path) => path.reduce((acc, k) => isObj$3(acc) ? acc[k] : void 0, o);
	function isCdnUrl(u) {
		if (typeof u !== "string" || u.length > 2e3) return false;
		try {
			const x = new URL(u);
			if (x.protocol !== "https:" || x.username || x.password || x.port) return false;
			const h = x.hostname.toLowerCase();
			return h.endsWith(".cdninstagram.com") || h.endsWith(".fbcdn.net");
		} catch {
			return false;
		}
	}
	function pickImage(candidates) {
		const list = arr$1(candidates).filter(isObj$3).map((c) => ({
			url: c.url,
			width: num(c.width),
			height: num(c.height)
		})).filter((c) => isCdnUrl(c.url)).sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
		if (!list.length) return null;
		const largest = list[list.length - 1];
		const full = list.find((c) => (c.width ?? 0) >= 1080) ?? largest;
		const thumb = list.find((c) => (c.width ?? 0) >= 600) ?? largest;
		return {
			full: full.url,
			thumb: thumb.url,
			width: full.width,
			height: full.height
		};
	}
	function mediaImage(raw) {
		return pickImage(get(raw, "image_versions2", "candidates"));
	}
	function kindOf$1(raw) {
		const t = num(raw.media_type);
		if (t === 8 || arr$1(raw.carousel_media).length) return "carousel";
		if (t === 2 || arr$1(raw.video_versions).length) return "video";
		return "photo";
	}
	function musicOf(raw) {
		const asset = get(arr$1(raw.story_music_stickers)[0], "music_asset_info") ?? get(raw, "clips_metadata", "music_info", "music_asset_info") ?? get(raw, "music_metadata", "music_info", "music_asset_info");
		const title = str$2(get(asset, "title"), 200);
		const artist = str$2(get(asset, "display_artist"), 200);
		if (title && artist) return `${title} by ${artist}`;
		return title ?? artist;
	}
	function mentionsOf(raw) {
		const names = new Set();
		const add = (v) => {
			const s = str$2(v, 60);
			if (s && /^[A-Za-z0-9._]{1,30}$/.test(s)) names.add(s.toLowerCase());
		};
		for (const m of arr$1(raw.reel_mentions)) add(get(m, "user", "username"));
		for (const s of arr$1(raw.story_bloks_stickers)) add(get(s, "bloks_sticker", "sticker_data", "ig_mention", "username"));
		for (const t of arr$1(get(raw, "usertags", "in"))) add(get(t, "user", "username"));
		return [...names].slice(0, 20);
	}
	function locationOf(raw) {
		return str$2(get(raw, "location", "name"), 200) ?? str$2(get(arr$1(raw.story_locations)[0], "location", "name"), 200);
	}
	function linkOf(raw) {
		const u = str$2(get(arr$1(raw.story_link_stickers)[0], "story_link", "url"), 500);
		return u && /^https?:\/\//.test(u) ? u : null;
	}
	function idOf$1(raw) {
		const v = raw.pk ?? raw.id;
		const s = typeof v === "number" ? String(v) : typeof v === "string" ? v : null;
		return s && /^[0-9_]+$/.test(s) ? s.split("_")[0] : null;
	}
	function toMedia(raw) {
		if (!isObj$3(raw)) return null;
		const id = idOf$1(raw);
		if (!id) return null;
		const kind = kindOf$1(raw);
		const slides = arr$1(raw.carousel_media).filter(isObj$3).map((s, i) => ({
			id: idOf$1(s) ?? `${id}-${i + 1}`,
			kind: kindOf$1(s) === "video" ? "video" : "photo",
			image: mediaImage(s),
			alt: str$2(s.accessibility_caption, 500)
		})).slice(0, 20);
		return {
			id,
			code: str$2(raw.code, 40),
			takenAt: num(raw.taken_at),
			kind,
			image: mediaImage(raw) ?? slides[0]?.image ?? null,
			alt: str$2(raw.accessibility_caption, 500),
			caption: str$2(get(raw, "caption", "text"), 2200),
			location: locationOf(raw),
			music: musicOf(raw),
			mentions: mentionsOf(raw),
			link: linkOf(raw),
			videoSeconds: num(raw.video_duration),
			slides
		};
	}
	function ownerOf(raw) {
		if (!isObj$3(raw)) return null;
		const v = get(raw, "user", "pk") ?? get(raw, "user", "id") ?? get(raw, "owner", "pk") ?? get(raw, "owner", "id") ?? raw.owner_id;
		if (typeof v === "string" || typeof v === "number") return String(v);
		const id = typeof raw.id === "string" ? raw.id : null;
		return id && /^\d+_\d+$/.test(id) ? id.split("_")[1] : null;
	}
	function toUser(raw) {
		if (!isObj$3(raw)) return null;
		const id = raw.pk ?? raw.id;
		const username = str$2(raw.username, 30);
		if (typeof id !== "string" && typeof id !== "number" || !username) return null;
		const links = [...arr$1(raw.bio_links).map((l) => str$2(get(l, "url"), 500)), str$2(raw.external_url, 500)].filter((u) => !!u && /^https?:\/\//.test(u));
		const pic = [
			get(raw, "hd_profile_pic_url_info", "url"),
			raw.profile_pic_url_hd,
			raw.profile_pic_url
		].find(isCdnUrl) ?? null;
		const fs = isObj$3(raw.friendship_status) ? raw.friendship_status : null;
		return {
			id: String(id),
			username: username.toLowerCase(),
			fullName: str$2(raw.full_name, 100),
			biography: str$2(raw.biography, 1e3),
			links: [...new Set(links)].slice(0, 10),
			category: str$2(raw.category, 100) ?? str$2(raw.category_name, 100),
			followers: num(raw.follower_count) ?? num(get(raw, "edge_followed_by", "count")),
			following: num(raw.following_count) ?? num(get(raw, "edge_follow", "count")),
			postCount: num(raw.media_count) ?? num(get(raw, "edge_owner_to_timeline_media", "count")),
			isPrivate: raw.is_private === true,
			isVerified: raw.is_verified === true,
			profilePic: pic,
			viewerFollows: typeof fs?.following === "boolean" ? fs.following : typeof raw.followed_by_viewer === "boolean" ? raw.followed_by_viewer : null,
			followsViewer: typeof fs?.followed_by === "boolean" ? fs.followed_by : typeof raw.follows_viewer === "boolean" ? raw.follows_viewer : null
		};
	}
	function toHighlightStub(raw) {
		if (!isObj$3(raw)) return null;
		const id = typeof raw.id === "string" ? raw.id : null;
		if (!id || !/^highlight:\d+$/.test(id)) return null;
		const cover = [get(raw, "cover_media", "cropped_image_version", "url"), get(raw, "cover_media", "full_image_version", "url")].find(isCdnUrl) ?? null;
		return {
			id,
			title: str$2(raw.title, 100) ?? "",
			cover
		};
	}
	function suggestName(fullName, username) {
		const cap = (w) => w.slice(0, 1).toUpperCase() + w.slice(1);
		const handleWords = username.toLowerCase().split(/[._\d]+/).filter((w) => /^[a-z]{2,}$/.test(w));
		const rawFirst = (fullName ?? "").normalize("NFKC").trim().split(/\s+/)[0] ?? "";
		const first = rawFirst.replace(/[^\p{L}\p{M}'-]/gu, "");
		if (first.length >= 2) {
			const f = first.toLowerCase();
			return cap((first !== rawFirst ? handleWords.find((w) => w !== f && w.includes(f) && w.length - f.length <= 2) : void 0) ?? first);
		}
		return handleWords[0] ? cap(handleWords[0]) : username;
	}
	var KEEP_PROFILES = 4;
	var isObj$2 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
	var ProfileCapture = class {
		byId = new Map();
		idByName = new Map();
		lastUserId = null;
		entry(id) {
			let e = this.byId.get(id);
			if (!e) {
				e = {
					user: null,
					posts: new Map(),
					morePosts: false,
					tray: null
				};
				this.byId.set(id, e);
			}
			this.byId.delete(id);
			this.byId.set(id, e);
			while (this.byId.size > KEEP_PROFILES) {
				const oldest = this.byId.keys().next().value;
				this.byId.delete(oldest);
				for (const [name, uid] of this.idByName) if (uid === oldest) this.idByName.delete(name);
			}
			return e;
		}
		ingest(json) {
			const data = isObj$2(json) && isObj$2(json.data) ? json.data : null;
			if (!data) return false;
			let kept = false;
			for (const [key, value] of Object.entries(data)) if (key === "user") kept = this.takeUser(value) || kept;
			else if (key === "highlights") kept = this.takeTray(value) || kept;
			else if (/user_timeline/.test(key)) kept = this.takeTimeline(value) || kept;
			if (kept) this.version++;
			return kept;
		}
		version = 0;
		takeUser(raw) {
			if (!isObj$2(raw) || !("biography" in raw) && !("follower_count" in raw)) return false;
			const user = toUser(raw);
			if (!user) return false;
			this.idByName.set(user.username, user.id);
			const e = this.entry(user.id);
			e.user = e.user ? mergeUser(e.user, user) : user;
			if ("biography" in raw) this.lastUserId = user.id;
			return true;
		}
		takeTray(raw) {
			const edges = isObj$2(raw) && Array.isArray(raw.edges) ? raw.edges : null;
			if (!edges) return false;
			const byOwner = new Map();
			for (const edge of edges) {
				const node = isObj$2(edge) ? edge.node : null;
				const owner = isObj$2(node) && isObj$2(node.user) ? node.user.id ?? node.user.pk : null;
				const stub = toHighlightStub(node);
				if (!stub || typeof owner !== "string" && typeof owner !== "number") continue;
				const list = byOwner.get(String(owner)) ?? [];
				list.push(stub);
				byOwner.set(String(owner), list);
			}
			for (const [owner, list] of byOwner) this.entry(owner).tray = list;
			if (edges.length === 0 && this.lastUserId && this.byId.has(this.lastUserId)) {
				const e = this.byId.get(this.lastUserId);
				if (e.tray === null) e.tray = [];
				return true;
			}
			return byOwner.size > 0;
		}
		takeTimeline(raw) {
			const edges = isObj$2(raw) && Array.isArray(raw.edges) ? raw.edges : null;
			if (!edges) return false;
			let kept = false;
			const owners = new Set();
			for (const edge of edges) {
				const node = isObj$2(edge) ? edge.node : null;
				const owner = ownerOf(node);
				const media = toMedia(node);
				if (!owner || !media) continue;
				owners.add(owner);
				this.entry(owner).posts.set(media.id, media);
				kept = true;
			}
			const more = isObj$2(raw) && isObj$2(raw.page_info) ? raw.page_info.has_next_page === true : false;
			for (const owner of owners) this.entry(owner).morePosts = more;
			return kept;
		}
		snapshot(username) {
			const id = this.idByName.get(username.toLowerCase());
			const e = id ? this.byId.get(id) : void 0;
			if (!e?.user) return null;
			const posts = [...e.posts.values()].sort((a, b) => (b.takenAt ?? 0) - (a.takenAt ?? 0));
			return {
				user: e.user,
				posts,
				morePosts: e.morePosts,
				tray: e.tray
			};
		}
		heldIds() {
			return [...this.byId.keys()];
		}
	};
	function mergeUser(older, newer) {
		const out = { ...older };
		for (const [k, v] of Object.entries(newer)) if (!(v === null || v === void 0 || v === "" || Array.isArray(v) && v.length === 0) || !(k in out)) out[k] = v;
		return out;
	}
	var GuardError = class extends Error {
		constructor(path) {
			super(`RizzBot Connect refused to send a request it is not allowed to make: ${path.slice(0, 120)}`);
			this.name = "GuardError";
		}
	};
	var ALLOWED = [
		/^\/api\/v1\/feed\/reels_media\/\?reel_ids=highlight%3A\d{1,25}(?:&reel_ids=highlight%3A\d{1,25}){0,9}$/,
		/^\/api\/v1\/direct_v2\/threads\/\d{1,40}\/\?limit=50$/,
		/^\/api\/v1\/direct_v2\/threads\/\d{1,40}\/\?cursor=[A-Za-z0-9_%=-]{1,600}&direction=older&limit=50$/,
		/^\/api\/v1\/direct_v2\/inbox\/\?limit=40$/,
		/^\/api\/v1\/direct_v2\/inbox\/\?cursor=[A-Za-z0-9_%=-]{1,600}&direction=older&limit=40$/
	];
	var FORBIDDEN = /seen|follow|friendship|like|comment|\/stories?\/|\/reel\/|create|delete|edit|block|report|mute|broadcast|\/items\/|approve|decline|hide|leave|direct_v2\/(?!threads\/\d{1,40}\/\?|inbox\/\?)|media\/\d+\/(?!$)/i;
	function hasForbiddenWord(path) {
		return FORBIDDEN.test(path.replace(/([?&]cursor=)[^&]*/, "$1"));
	}
	function isAllowedPath(path) {
		return ALLOWED.some((r) => r.test(path)) && !hasForbiddenWord(path);
	}
	function assertAllowed(path) {
		if (!isAllowedPath(path)) throw new GuardError(path);
	}
	function reelsMediaPath(ids) {
		if (!ids.length || ids.length > 10) throw new GuardError(`reels_media with ${ids.length} ids`);
		for (const id of ids) if (!/^highlight:\d{1,25}$/.test(id)) throw new GuardError(`reel id ${id}`);
		const path = "/api/v1/feed/reels_media/?" + ids.map((id) => "reel_ids=" + encodeURIComponent(id)).join("&");
		assertAllowed(path);
		return path;
	}
	function threadPath(threadId, cursor) {
		if (!/^\d{1,40}$/.test(threadId)) throw new GuardError(`thread ${threadId}`);
		const path = `/api/v1/direct_v2/threads/${threadId}/?` + (cursor ? `cursor=${encodeURIComponent(cursor)}&direction=older&limit=50` : "limit=50");
		assertAllowed(path);
		return path;
	}
	function inboxPath(cursor) {
		const path = "/api/v1/direct_v2/inbox/?" + (cursor ? `cursor=${encodeURIComponent(cursor)}&direction=older&limit=40` : "limit=40");
		assertAllowed(path);
		return path;
	}
	var InstagramError = class extends Error {
		kind;
		constructor(kind, message) {
			super(message);
			this.kind = kind;
			this.name = "InstagramError";
		}
	};
	var COPY = {
		"slow-down": "Instagram asked to slow down. Wait a few minutes before trying again.",
		login: "Instagram wants you to confirm your login. Reload Instagram, confirm it, then try again.",
		gone: "This account is no longer on Instagram.",
		failed: "Instagram did not answer as expected. Reload her profile and try again."
	};
	var WEB_APP_ID = "936619743392459";
	function headersFor(env) {
		const csrf = /(?:^|;\s*)csrftoken=([^;]+)/.exec(env.cookie)?.[1] ?? "";
		return {
			accept: "*/*",
			"x-ig-app-id": env.appId && /^\d+$/.test(env.appId) ? env.appId : WEB_APP_ID,
			"x-csrftoken": csrf,
			"x-ig-www-claim": env.wwwClaim || "0",
			"x-requested-with": "XMLHttpRequest",
			"x-asbd-id": "359341"
		};
	}
	var SLOW_DOWN_RE = /wait a few minutes|please wait|try again later|"spam":\s*true/;
	var LOGIN_RE = /checkpoint_required|challenge_required|login_required|"require_login":\s*true/;
	function failureFrom(status, body) {
		const lower = body.slice(0, 2e3).toLowerCase();
		if (status === 429 || SLOW_DOWN_RE.test(lower)) return new InstagramError("slow-down", COPY["slow-down"]);
		if (status === 401 || status === 403 || LOGIN_RE.test(lower)) return new InstagramError("login", COPY.login);
		return new InstagramError("failed", COPY.failed);
	}
	function readAnswer(status, text) {
		if (status < 200 || status >= 300) throw failureFrom(status, text);
		let json;
		try {
			json = JSON.parse(text);
		} catch {
			throw new InstagramError("failed", COPY.failed);
		}
		const top = json && typeof json === "object" ? json : null;
		if (top && (top.status === "fail" || typeof top.message === "string" && (LOGIN_RE.test(top.message.toLowerCase()) || SLOW_DOWN_RE.test(top.message.toLowerCase())))) throw failureFrom(status, JSON.stringify(json));
		return json;
	}
	var READ_TIMEOUT_MS = 3e4;
	var IG_ORIGIN = "https://www.instagram.com";
	function createIgGet(pageFetch, env) {
		return async (path) => {
			assertAllowed(path);
			let r;
			try {
				const url = new URL(path, IG_ORIGIN);
				if (url.origin !== IG_ORIGIN) throw new InstagramError("failed", "RizzBot Connect refused a request that was not to Instagram.");
				r = await pageFetch(url.href, {
					method: "GET",
					credentials: "same-origin",
					headers: headersFor(env()),
					signal: AbortSignal.timeout(READ_TIMEOUT_MS)
				});
				return readAnswer(r.status, await r.text());
			} catch (e) {
				if (e instanceof InstagramError) throw e;
				throw new InstagramError("failed", COPY.failed);
			}
		};
	}
	var LIMITS = {
		highlights: 30,
		posts: 36,
		scrolls: 3,
		pauseMin: 1500,
		pauseMax: 3e3
	};
	var SEND_FRAMES = 200;
	var NeedReloadError = class extends Error {
		constructor() {
			super("RizzBot Connect has not seen her profile load yet. Reload the page, then press Add to RizzBot again.");
			this.name = "NeedReloadError";
		}
	};
	var isObj$1 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
	function reelsOf(json) {
		const out = new Map();
		if (!isObj$1(json)) return out;
		if (isObj$1(json.reels)) {
			for (const [id, reel] of Object.entries(json.reels)) if (isObj$1(reel) && Array.isArray(reel.items)) out.set(id, reel.items);
		}
		if (Array.isArray(json.reels_media)) {
			for (const reel of json.reels_media) if (isObj$1(reel) && typeof reel.id === "string" && Array.isArray(reel.items) && !out.has(reel.id)) out.set(reel.id, reel.items);
		}
		return out;
	}
	async function collect(username, d) {
		const rnd = d.random ?? Math.random;
		const pause = () => d.sleep(LIMITS.pauseMin + rnd() * (LIMITS.pauseMax - LIMITS.pauseMin));
		const snap = d.capture.snapshot(username);
		if (!snap) throw new NeedReloadError();
		const { user } = snap;
		const notes = [];
		let requests = 0;
		const limited = user.isPrivate && user.viewerFollows !== true;
		let posts = [];
		let postsComplete = false;
		const highlights = [];
		let highlightsSkipped = 0;
		let highlightsLoaded = true;
		if (!limited) {
			let cur = snap;
			for (let i = 0; i < LIMITS.scrolls && cur.morePosts && cur.posts.length < LIMITS.posts; i++) {
				d.progress("Scrolling her grid for more posts", .15 + i * .1);
				await d.loadMorePosts();
				const next = d.capture.snapshot(username) ?? cur;
				const grew = next.posts.length > cur.posts.length;
				cur = next;
				if (!grew) break;
			}
			const newest = [...cur.posts].sort((a, b) => (b.takenAt ?? 0) - (a.takenAt ?? 0));
			posts = newest.slice(0, 60);
			postsComplete = !cur.morePosts && newest.length <= 60;
			if (cur.morePosts && cur.posts.length < LIMITS.posts && (user.postCount ?? 0) > cur.posts.length) notes.push("Some of her older posts did not load. Scroll her grid down, then import again to add them.");
			const latest = d.capture.snapshot(username) ?? snap;
			highlightsLoaded = latest.tray !== null;
			const tray = latest.tray ?? [];
			const toRead = tray.slice(0, LIMITS.highlights);
			highlightsSkipped = tray.length - toRead.length;
			let stopped = false;
			for (let i = 0; i < toRead.length; i += 10) {
				const batch = toRead.slice(i, i + 10);
				if (stopped) {
					highlightsSkipped += batch.length;
					continue;
				}
				d.progress(`Reading her highlights (${Math.min(i + batch.length, toRead.length)} of ${toRead.length})`, .45 + .5 * (i / Math.max(1, toRead.length)));
				if (requests > 0) await pause();
				requests++;
				try {
					const reels = reelsOf(await d.ig(reelsMediaPath(batch.map((h) => h.id))));
					for (const stub of batch) {
						const items = (reels.get(stub.id) ?? []).map(toMedia).filter((m) => !!m).slice(0, SEND_FRAMES);
						highlights.push({
							...stub,
							items
						});
					}
				} catch (e) {
					if (e instanceof InstagramError && e.kind === "login") throw e;
					highlightsSkipped += batch.length;
					if (e instanceof InstagramError && e.kind === "slow-down") stopped = true;
				}
			}
			if (highlightsSkipped > 0) notes.push(`${highlightsSkipped} of her highlights were not read. Import her again later to add them.`);
			if (latest.tray === null) notes.push("Her highlights had not loaded, so none came in. Reload and import again to add them.");
		} else notes.push("Her account is private and you do not follow her, so only her name, bio and photo came in.");
		return {
			payload: {
				[PAYLOAD_MARK]: 1,
				version: 1,
				source: "rizzbot-connect",
				scriptVersion: d.scriptVersion,
				capturedAt: (d.now ?? (() => new Date()))().toISOString(),
				access: limited ? "limited" : "full",
				user,
				posts,
				postsComplete,
				highlights,
				highlightsSkipped,
				highlightsLoaded
			},
			note: notes.length ? notes.join(" ") : null
		};
	}
	var MAX_BODY$1 = 26214400;
	function isApiUrl(url, origin = "https://www.instagram.com") {
		try {
			const u = new URL(url, origin);
			return u.origin === origin && (/^\/api\/(graphql|v1\/)/.test(u.pathname) || /^\/graphql\/query/.test(u.pathname));
		} catch {
			return false;
		}
	}
	function parseBodies(text) {
		if (!text || text.length > MAX_BODY$1) return [];
		const clean = text.replace(/^\s*for\s*\(;;\);\s*/, "");
		const out = [];
		for (const line of clean.split(/\r?\n/)) {
			const t = line.trim();
			if (!t || t[0] !== "{" && t[0] !== "[") continue;
			try {
				out.push(JSON.parse(t));
			} catch {}
		}
		return out;
	}
	var INSTALLED$1 = new WeakMap();
	async function boundedText(resp) {
		const body = resp.body;
		if (!body) return resp.text();
		const reader = body.getReader();
		const chunks = [];
		let size = 0;
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > MAX_BODY$1) {
				reader.cancel().catch(() => {});
				return null;
			}
			chunks.push(value);
		}
		const all = new Uint8Array(size);
		let at = 0;
		for (const c of chunks) {
			all.set(c, at);
			at += c.byteLength;
		}
		return new TextDecoder().decode(all);
	}
	function installHooks$1(win, sink) {
		const existing = INSTALLED$1.get(win);
		if (existing) return existing;
		const origin = win.location.origin;
		const deliver = (url, text) => {
			for (const json of parseBodies(text)) try {
				sink(url, json);
			} catch {}
		};
		const origFetch = win.fetch.bind(win);
		win.fetch = function(input, init) {
			const p = origFetch(input, init);
			p.then((resp) => {
				try {
					const url = resp.url || (typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
					if (isApiUrl(url, origin)) boundedText(resp.clone()).then((t) => t !== null && deliver(url, t), () => {});
				} catch {}
			}, () => {});
			return p;
		};
		const XHR = win.XMLHttpRequest.prototype;
		const open = XHR.open;
		const send = XHR.send;
		const urls = new WeakMap();
		XHR.open = function(...args) {
			urls.set(this, String(args[1] ?? ""));
			return open.apply(this, args);
		};
		XHR.send = function(...args) {
			const url = urls.get(this) ?? "";
			if (isApiUrl(url, origin)) this.addEventListener("load", () => {
				try {
					if (this.responseType === "" || this.responseType === "text") deliver(url, this.responseText);
				} catch {}
			});
			return send.apply(this, args);
		};
		const hooked = { pageFetch: origFetch };
		INSTALLED$1.set(win, hooked);
		return hooked;
	}
	var RESERVED = new Set([
		"explore",
		"direct",
		"accounts",
		"reels",
		"reel",
		"stories",
		"p",
		"tv",
		"about",
		"legal",
		"developer",
		"web",
		"emails",
		"challenge",
		"session",
		"privacy",
		"terms",
		"api",
		"graphql",
		"static",
		"ajax",
		"nametag",
		"directory",
		"topics",
		"lite",
		"oauth",
		"settings",
		"notifications",
		"your_activity",
		"ar",
		"create",
		"threads",
		"meta",
		"help",
		"press",
		"jobs",
		"blog",
		"download"
	]);
	function profileFromPath(pathname) {
		const m = /^\/([A-Za-z0-9._]{1,30})\/?(?:(?:tagged|reels|saved|followers|following)\/?)?$/.exec(pathname);
		if (!m) return null;
		const name = m[1].toLowerCase();
		return RESERVED.has(name) ? null : name;
	}
	function onUrlChange$1(win, cb, everyMs = 600) {
		let last = win.location.href;
		const check = () => {
			if (win.location.href !== last) {
				last = win.location.href;
				cb();
			}
		};
		const t = win.setInterval(check, everyMs);
		win.addEventListener("popstate", check);
		return () => {
			win.clearInterval(t);
			win.removeEventListener("popstate", check);
		};
	}
	var CHAT_MARK = "__rizzbot_instagram_chat__";
	var HEART = /^\u2764\ufe0f?$/;
	function heartedByOther(item, author, mine, viewerId) {
		const r = isObj(item.reactions) ? item.reactions : null;
		if (!r) return false;
		const senders = [];
		for (const e of Array.isArray(r.emojis) ? r.emojis : []) if (isObj(e) && typeof e.emoji === "string" && HEART.test(e.emoji.trim()) && e.sender_id != null) senders.push(String(e.sender_id));
		for (const l of Array.isArray(r.likes) ? r.likes : []) if (isObj(l) && l.sender_id != null) senders.push(String(l.sender_id));
		return senders.some((sid) => {
			if (author) return sid !== author;
			if (viewerId === null) return false;
			return mine ? sid !== viewerId : sid === viewerId;
		});
	}
	var SyncStopped = class extends Error {
		constructor() {
			super("Stopped.");
			this.name = "SyncStopped";
		}
	};
	var GroupChatError = class extends Error {
		constructor() {
			super("This is a group chat. RizzBot syncs one girl's chat at a time.");
			this.name = "GroupChatError";
		}
	};
	var ITEM_WORDS = {
		clip: "[shared a reel]",
		xma_clip: "[shared a reel]",
		media_share: "[shared a post]",
		xma_media_share: "[shared a post]",
		xma_reel_share: "[replied to a story]",
		xma_story_share: "[shared a story]",
		felix_share: "[shared a video]",
		story_share: "[shared a story]",
		reel_share: "[replied to a story]",
		animated_media: "[sent a gif]",
		media: "[sent a photo]",
		raven_media: "[sent a disappearing photo]",
		visual_media: "[sent a disappearing photo]",
		voice_media: "[sent a voice message]",
		like: "[sent a heart]",
		location: "[shared a location]",
		profile: "[shared a profile]",
		link: "[sent a link]"
	};
	var NOT_MESSAGES = new Set([
		"action_log",
		"placeholder",
		"video_call_event",
		"expired_placeholder"
	]);
	var isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
	var str$1 = (v) => typeof v === "string" && v.trim() ? v.trim() : null;
	function messageOf(item, viewerId) {
		if (!isObj(item)) return null;
		const type = str$1(item.item_type) ?? "";
		if (NOT_MESSAGES.has(type)) return null;
		const id = str$1(item.item_id) ?? str$1(item.message_id);
		if (!id) return null;
		const mine = item.is_sent_by_viewer === true || viewerId !== null && String(item.user_id ?? "") === viewerId;
		let text = null;
		if (type === "text") text = str$1(item.text);
		else if (type === "link") text = str$1(isObj(item.link) ? item.link.text : null) ?? ITEM_WORDS.link;
		else {
			const words = ITEM_WORDS[type] ?? "[sent something]";
			const own = str$1(isObj(item.reel_share) ? item.reel_share.text : null) ?? str$1(item.text);
			text = own ? `${words} ${own}` : words;
		}
		if (!text) return null;
		const ts = Number(item.timestamp);
		const at = Number.isFinite(ts) && ts > 0 ? new Date(ts > 0x5af3107a4000 ? ts / 1e3 : ts > 1e11 ? ts : ts * 1e3).toISOString() : null;
		const liked = heartedByOther(item, item.user_id != null && String(item.user_id) ? String(item.user_id) : null, mine, viewerId);
		return {
			id,
			from: mine ? "him" : "her",
			text: text.slice(0, 4e3),
			at,
			...liked ? { liked: true } : {}
		};
	}
	function reachedMark(messages, mark) {
		if (!mark) return false;
		if (mark.ig_id && messages.some((m) => m.id === mark.ig_id)) return true;
		const t = mark.at ? Date.parse(mark.at) : NaN;
		if (Number.isNaN(t)) return false;
		return messages.some((m) => m.at !== null && Date.parse(m.at) <= t);
	}
	var MAX_MESSAGES = 6e3;
	var SLOW_DOWN_WAIT_MS = 3e4;
	async function collectChat(threadId, d) {
		const rnd = d.random ?? Math.random;
		const byId = new Map();
		const seenItems = new Set();
		let her = null;
		let viewerId = null;
		let cursor = null;
		let waited = false;
		let slowed = false;
		let mark = null;
		let complete = false;
		let reached = false;
		for (let page = 0; page < 120; page++) {
			if (d.stopped?.()) throw new SyncStopped();
			if (page > 0) await d.sleep(1500 + rnd() * 1500);
			if (d.stopped?.()) throw new SyncStopped();
			let json;
			try {
				json = await d.ig(threadPath(threadId, cursor));
			} catch (e) {
				if (page > 0 && e instanceof InstagramError && e.kind === "slow-down") {
					if (waited) {
						slowed = true;
						break;
					}
					waited = true;
					d.progress(byId.size, true, mark !== null);
					await d.sleep(SLOW_DOWN_WAIT_MS);
					page--;
					continue;
				}
				throw e;
			}
			const thread = isObj(json) && isObj(json.thread) ? json.thread : null;
			if (!thread) throw new InstagramError("failed", "Instagram did not hand over the chat. Reload it and try again.");
			if (page === 0) {
				const users = Array.isArray(thread.users) ? thread.users.filter(isObj) : [];
				if (thread.is_group === true || users.length > 1) throw new GroupChatError();
				if (!users.length) throw new InstagramError("gone", "This account is no longer on Instagram, so its chat cannot be synced.");
				const u = users[0];
				const id = String(u.pk ?? u.id ?? "");
				const username = str$1(u.username)?.toLowerCase() ?? "";
				if (!/^\d+$/.test(id) || !username) throw new InstagramError("failed", "Instagram did not say who this chat is with. Reload it and try again.");
				her = {
					id,
					username
				};
				viewerId = thread.viewer_id != null ? String(thread.viewer_id) : null;
				if (d.markFor) mark = await d.markFor(her);
			}
			if (d.stopped?.()) throw new SyncStopped();
			const items = Array.isArray(thread.items) ? thread.items : [];
			const pageMessages = [];
			let fresh = 0;
			for (const item of items) {
				const key = isObj(item) ? String(item.item_id ?? item.message_id ?? "") : "";
				if (key && !seenItems.has(key)) {
					seenItems.add(key);
					fresh++;
				}
				const m = messageOf(item, viewerId);
				if (m) pageMessages.push(m);
				if (m && !byId.has(m.id)) byId.set(m.id, m);
			}
			const next = typeof thread.oldest_cursor === "string" && thread.oldest_cursor ? thread.oldest_cursor : null;
			const atMark = reachedMark(pageMessages, mark);
			if (atMark) reached = true;
			const more = fresh > 0 && next !== null && next !== cursor && !atMark;
			d.progress(byId.size, more, mark !== null);
			if (!more) {
				complete = true;
				break;
			}
			cursor = next;
		}
		const messages = [...byId.values()].reverse();
		return {
			[CHAT_MARK]: 1,
			version: 1,
			her,
			messages,
			truncated: !complete,
			capped: !complete && !slowed,
			reached
		};
	}
	function threadFromPath(pathname) {
		return /^\/direct\/t\/(\d{1,40})\/?/.exec(pathname)?.[1] ?? null;
	}
	async function resolveThreadId(urlId, d) {
		let cursor = null;
		for (let page = 0; page < 10; page++) {
			if (d.stopped?.()) throw new SyncStopped();
			if (page > 0) await d.sleep(1200);
			if (d.stopped?.()) throw new SyncStopped();
			const json = await d.ig(inboxPath(cursor));
			if (d.stopped?.()) throw new SyncStopped();
			const inbox = isObj(json) && isObj(json.inbox) ? json.inbox : null;
			const hit = (inbox && Array.isArray(inbox.threads) ? inbox.threads.filter(isObj) : []).find((t) => [
				t.messaging_thread_key,
				t.thread_v2_id,
				t.thread_id
			].some((v) => v != null && String(v) === urlId));
			if (hit) {
				const id = String(hit.thread_v2_id ?? hit.thread_id ?? "");
				return /^\d{1,40}$/.test(id) ? id : null;
			}
			if (!inbox || inbox.has_older !== true || typeof inbox.oldest_cursor !== "string") return null;
			cursor = inbox.oldest_cursor;
		}
		return null;
	}
	function userIds(u) {
		return [
			u.pk,
			u.pk_id,
			u.id,
			u.strong_id__
		].filter((v) => v != null).map(String);
	}
	async function findThreadWith(user, d) {
		const handle = user.username.toLowerCase();
		let cursor = null;
		for (let page = 0; page < 10; page++) {
			if (d.stopped?.()) throw new SyncStopped();
			if (page > 0) await d.sleep(1200);
			if (d.stopped?.()) throw new SyncStopped();
			const json = await d.ig(inboxPath(cursor));
			if (d.stopped?.()) throw new SyncStopped();
			const inbox = isObj(json) && isObj(json.inbox) ? json.inbox : null;
			const hit = (inbox && Array.isArray(inbox.threads) ? inbox.threads.filter(isObj) : []).find((t) => {
				if (t.is_group === true) return false;
				const users = Array.isArray(t.users) ? t.users.filter(isObj) : [];
				if (users.length !== 1) return false;
				const ids = userIds(users[0]);
				return ids.length ? ids.includes(user.id) : typeof users[0].username === "string" && users[0].username.toLowerCase() === handle;
			});
			if (hit) {
				const id = String(hit.thread_v2_id ?? hit.thread_id ?? "");
				return {
					threadId: /^\d{1,40}$/.test(id) ? id : null,
					complete: true
				};
			}
			if (!inbox || inbox.has_older !== true || typeof inbox.oldest_cursor !== "string") return {
				threadId: null,
				complete: !!inbox
			};
			cursor = inbox.oldest_cursor;
		}
		return {
			threadId: null,
			complete: false
		};
	}
	var ReadCutShort = class extends Error {};
	var ChatSkipped = class extends Error {};
	function sendDecision(r) {
		if (r.partial && !r.reached) return r.truncated ? { send: false } : {
			send: true,
			full: true
		};
		return {
			send: true,
			full: !r.partial
		};
	}
	function offerNewGirl(status, body) {
		if (status === 404) return true;
		return status === 409 && !body?.busy && !body?.code;
	}
	function chatEndFor(e, threadId) {
		const t = threadId ?? void 0;
		if (e instanceof ChatSkipped) return {
			detail: "skipped",
			ok: false,
			skipped: true
		};
		if (e instanceof ReadCutShort) return {
			detail: "read in part, not sent",
			ok: false,
			skipped: true,
			...t ? { resync: t } : {}
		};
		if (e instanceof SyncStopped) return {
			detail: "stopped",
			ok: false,
			skipped: true,
			...t ? { retry: t } : {}
		};
		if (e instanceof ApiError && e.status === 409 && e.body?.gap === true) return {
			detail: "read in part, not sent",
			ok: false,
			skipped: true,
			...t ? { resync: t } : {}
		};
		return {
			detail: "not synced",
			ok: false,
			why: e instanceof ApiError || e instanceof InstagramError || e instanceof NotConnectedError || e instanceof GroupChatError ? e.message : "Something went wrong reading the chat.",
			...t && !(e instanceof GroupChatError) ? { retry: t } : {}
		};
	}
	var instagram_exports = __exportAll({
		ago: () => ago,
		start: () => start$1,
		timing: () => timing$1
	});
	var LOAD_GRACE_MS = 6e3;
	var MORE_POSTS_WAIT_MS = 5e3;
	var PROFILE_SHARE = .45;
	var CHAT_FROM = .5;
	var syncedKey = (threadId) => `ig.chatSynced.${threadId}`;
	var addedKey = (origin, handle) => `ig.inRizzBot.${origin}.${handle.toLowerCase()}`;
	var threadKey = (urlId) => `ig.threadFor.${urlId}`;
	var KEEP_OPEN = "Keep this tab open until it finishes.";
	var NOT_IN_400 = "This chat is older than your newest 400 chats, so RizzBot Connect cannot find it. A new message from either of you brings it back up. Then sync again.";
	var timing$1 = { importingRecheckMs: 2e4 };
	var APP_NAMES = {
		hinge: "Hinge",
		tinder: "Tinder",
		bumble: "Bumble",
		whatsapp: "WhatsApp",
		imessage: "iMessage",
		sms: "texts"
	};
	var appName = (app) => APP_NAMES[app] ?? app.charAt(0).toUpperCase() + app.slice(1);
	function ago(ms, now = Date.now()) {
		const s = Math.max(0, Math.round((now - ms) / 1e3));
		if (s < 60) return "just now";
		const m = Math.round(s / 60);
		if (m < 60) return `${m} min ago`;
		const h = Math.round(m / 60);
		if (h < 24) return `${h} h ago`;
		const d = Math.round(h / 24);
		return d === 1 ? "1 day ago" : `${d} days ago`;
	}
	function start$1(host, win) {
		const capture = new ProfileCapture();
		const panel = new Panel(win.document);
		panel.setPlacement(() => {
			if (threadFromPath(win.location.pathname)) {
				const call = win.document.querySelector("svg[aria-label=\"Audio call\"]")?.closest("[role=\"button\"]");
				if (call?.parentElement) return {
					kind: "before",
					node: call
				};
			}
			return { kind: "fixed" };
		});
		let held = false;
		let profileSince = Date.now();
		let refreshTimer = null;
		const threadByHandle = new Map();
		const { pageFetch } = installHooks$1(win, (_url, json) => {
			noteThread(json);
			if (capture.ingest(json) && !held) scheduleRefresh();
		});
		function noteThread(json) {
			const j = json;
			if (!j || typeof j.thread_v2_id !== "string" || !/^\d{1,40}$/.test(j.thread_v2_id) || !Array.isArray(j.users) || j.users.length !== 1) return;
			const handle = typeof j.users[0]?.username === "string" ? j.users[0].username.toLowerCase() : null;
			if (handle) threadByHandle.set(handle, j.thread_v2_id);
		}
		const ig = createIgGet(pageFetch, () => ({
			cookie: win.document.cookie,
			wwwClaim: safe(() => win.sessionStorage.getItem("www-claim-v2"))
		}));
		const sleep = (ms) => new Promise((r) => win.setTimeout(r, ms));
		async function loadMorePosts() {
			const y = win.scrollY;
			const before = capture.version;
			const end = Date.now() + MORE_POSTS_WAIT_MS;
			while (capture.version === before && Date.now() < end) {
				win.scrollTo(0, win.document.documentElement.scrollHeight);
				await sleep(400);
			}
			await sleep(600);
			win.scrollTo(0, y);
		}
		const inRizzBot = new Map();
		const asking = new Set();
		function lookup(user) {
			const key = user.username.toLowerCase();
			if (inRizzBot.has(key) || asking.has(key)) return;
			asking.add(key);
			const q = `ig_id=${encodeURIComponent(user.id)}&username=${encodeURIComponent(key)}`;
			const api = createApi(host);
			const origin = api.origin;
			api.call("GET", `/api/girls/instagram-chat?${q}`, void 0, 8e3).then((r) => {
				if (typeof r.slug !== "string" || typeof r.name !== "string") throw new Error("not an answer");
				const girl = {
					slug: r.slug,
					name: r.name,
					...r.placeholder ? { unfinished: true } : {},
					...r.importing ? { importing: true } : {}
				};
				inRizzBot.set(key, girl);
				host.set(addedKey(origin, key), girl);
				if (girl.importing) win.setTimeout(() => {
					if (inRizzBot.get(key) === girl) inRizzBot.delete(key);
					refresh();
				}, timing$1.importingRecheckMs);
			}).catch((e) => {
				inRizzBot.set(key, null);
				if (e instanceof ApiError && e.status === 404) host.del(addedKey(origin, key));
			}).finally(() => {
				asking.delete(key);
				refresh();
			});
		}
		function knownGirl(handle) {
			const key = handle.toLowerCase();
			const now = inRizzBot.get(key);
			if (now !== void 0) return now;
			return host.get(addedKey(createApi(host).origin, key), null) ?? void 0;
		}
		function knownAdded(handle, girl) {
			inRizzBot.set(handle.toLowerCase(), girl);
			host.set(addedKey(createApi(host).origin, handle), girl);
		}
		function scheduleRefresh() {
			if (refreshTimer !== null) return;
			refreshTimer = win.setTimeout(() => {
				refreshTimer = null;
				refresh();
			}, 150);
		}
		function idle() {
			const threadId = threadFromPath(win.location.pathname);
			const username = profileFromPath(win.location.pathname);
			if (!username && !threadId) return { kind: "hidden" };
			if (!createApi(host).connected()) return {
				kind: "pill",
				label: "Connect RizzBot",
				onClick: () => openConnect(host, win.navigator.userAgent)
			};
			if (threadId) {
				const synced = host.get(syncedKey(threadId), null);
				if (typeof synced === "number") return {
					kind: "pill",
					ok: true,
					label: `Synced ${ago(synced)}`,
					title: "Press to sync the newest messages",
					onClick: () => void syncFromPage(threadId)
				};
				return {
					kind: "pill",
					label: "Sync chat to RizzBot",
					onClick: () => void syncFromPage(threadId)
				};
			}
			if (!username) return { kind: "hidden" };
			const snap = capture.snapshot(username);
			if (!snap) {
				if (Date.now() - profileSince < LOAD_GRACE_MS) return {
					kind: "pill",
					label: "Reading her profile",
					busy: true
				};
				return {
					kind: "pill",
					label: "Reload to import",
					onClick: () => win.location.reload()
				};
			}
			const key = snap.user.username.toLowerCase();
			if (inRizzBot.get(key) === void 0) lookup(snap.user);
			const girl = knownGirl(key);
			if (girl === void 0) return {
				kind: "pill",
				label: "Checking RizzBot",
				busy: true
			};
			if (girl?.unfinished && girl.importing) {
				const g = girl;
				return {
					kind: "pill",
					label: `Adding @${snap.user.username}`,
					title: "Her import is running. Press to open her in RizzBot",
					onClick: () => host.openTab(`${createApi(host).origin}/chats/${encodeURIComponent(g.slug)}`)
				};
			}
			if (girl?.unfinished) return {
				kind: "pill",
				label: `Finish adding @${snap.user.username}`,
				onClick: () => ask(username)
			};
			if (girl) {
				const g = girl;
				return {
					kind: "pill",
					ok: true,
					label: `${g.name} is in RizzBot`,
					onClick: () => showAdded(username, g)
				};
			}
			return {
				kind: "pill",
				label: `Add @${snap.user.username} to RizzBot`,
				onClick: () => ask(username)
			};
		}
		function showAdded(username, girl) {
			held = true;
			const api = createApi(host);
			panel.show({
				kind: "card",
				icon: "ok",
				title: `${girl.name} is in RizzBot`,
				text: ["Update her to bring in her newest posts and messages."],
				link: {
					label: "Open in RizzBot",
					icon: "open",
					first: true,
					href: `${api.origin}/chats/${encodeURIComponent(girl.slug)}`
				},
				buttons: [{
					label: "Update from Instagram",
					quiet: true,
					icon: "sync",
					onClick: () => void run(username, girl.name, null)
				}],
				onClose: release
			});
		}
		function refresh() {
			if (held) return;
			panel.render(idle());
		}
		let askingToConnect = false;
		function showConnect() {
			held = true;
			askingToConnect = true;
			panel.show({
				kind: "card",
				icon: "warn",
				title: "Connect RizzBot",
				text: ["One press links this browser to your RizzBot account. Then come back here."],
				buttons: [{
					label: "Connect",
					primary: true,
					icon: "link",
					onClick: () => openConnect(host, win.navigator.userAgent)
				}],
				onClose: () => {
					askingToConnect = false;
					release();
				}
			});
		}
		const release = () => {
			held = false;
			refresh();
		};
		function ask(username) {
			const snap = capture.snapshot(username);
			if (!snap) return refresh();
			held = true;
			const suggested = suggestName(snap.user.fullName, snap.user.username);
			panel.show({
				kind: "card",
				title: `Add ${suggested || "@" + snap.user.username} to RizzBot`,
				text: ["RizzBot reads her profile and your chat with her."],
				input: {
					label: "Her name",
					value: suggested,
					placeholder: "Her name"
				},
				buttons: [{
					label: "Add to RizzBot",
					primary: true,
					icon: "plus",
					onClick: (name) => void run(username, name.trim(), null)
				}],
				onClose: release
			});
		}
		async function run(username, name, choice, ready) {
			held = true;
			const known = knownGirl(username);
			const updating = !!known && !known.unfinished && !choice;
			const title = `${updating ? "Updating" : "Adding"} ${name || "@" + username}`;
			const show = (step, value) => panel.show({
				kind: "card",
				title,
				text: [KEEP_OPEN],
				icon: "spin",
				progress: {
					value,
					step
				}
			});
			const api = createApi(host);
			let res;
			let got = ready;
			try {
				if (!got) {
					show("Reading her profile", .03);
					got = await collect(username, {
						capture,
						ig,
						loadMorePosts,
						sleep,
						progress: (line, fraction) => show(line, (fraction ?? .1) * PROFILE_SHARE),
						scriptVersion: host.version
					});
				}
				show("Sending her profile", PROFILE_SHARE);
				try {
					res = await api.call("POST", "/api/girls/from-instagram", {
						payload: got.payload,
						...name ? { name } : {},
						...choice ?? {}
					}, 12e4);
				} catch (e) {
					const candidates = e instanceof ApiError && e.status === 409 && Array.isArray(e.body?.candidates) ? e.body.candidates : null;
					if (!candidates?.length) throw e;
					const keep = got;
					const ask = (k) => {
						const c = candidates[k];
						const next = candidates[k + 1];
						const meta = [c.platform ? appName(c.platform) : "", c.messages !== void 0 ? c.messages ? plural$1(c.messages, "message") : "no messages" : ""].filter(Boolean);
						panel.show({
							kind: "card",
							title: `Is this ${c.name}?`,
							portrait: {
								picture: typeof c.picture === "string" && c.picture.startsWith("data:image/") ? c.picture : null,
								initial: (c.name.trim()[0] ?? "?").toUpperCase(),
								corner: keep.payload.user.profilePic
							},
							meta,
							text: [c.reason === "same photo" ? `Her Instagram photo matches one of ${c.name}'s photos.` : `Same name as @${username}.`],
							textLink: {
								label: `Open ${c.name} in RizzBot`,
								href: `${api.origin}/chats/${encodeURIComponent(c.slug)}`
							},
							buttons: [
								{
									label: `Yes, add to ${c.name}`,
									primary: true,
									icon: "user",
									onClick: () => void run(username, name, { attach_to: c.slug }, keep)
								},
								{
									label: "No, new girl",
									icon: "plus",
									onClick: () => void run(username, name, { new: true }, keep)
								},
								...next ? [{
									label: `Or is it ${next.name}?`,
									quiet: true,
									onClick: () => ask(k + 1)
								}] : []
							],
							onClose: release
						});
					};
					ask(0);
					return;
				}
			} catch (e) {
				if (e instanceof NotConnectedError || e instanceof ApiError && e.status === 401) return showConnect();
				const message = e instanceof ApiError || e instanceof InstagramError || e instanceof NeedReloadError ? e.message : "Something went wrong. Reload her profile and try again.";
				const status = e instanceof ApiError ? e.status : 0;
				const buttons = e instanceof NeedReloadError ? [{
					label: "Reload",
					primary: true,
					icon: "retry",
					onClick: () => win.location.reload()
				}] : e instanceof InstagramError && e.kind !== "failed" ? [] : status === 402 ? [] : status === 413 ? [] : choice?.attach_to && offerNewGirl(status, e instanceof ApiError ? e.body : null) ? [{
					label: "Add her as a new girl",
					primary: true,
					icon: "plus",
					onClick: () => void run(username, name, { new: true }, got ?? ready)
				}] : [{
					label: "Try again",
					primary: true,
					icon: "retry",
					onClick: () => void run(username, name, choice, got ?? ready)
				}];
				panel.show({
					kind: "card",
					icon: "error",
					tone: "error",
					title: updating ? "Could not update her" : "Could not add her",
					text: [message],
					buttons,
					...status === 402 ? { link: {
						label: "See your plan",
						icon: "open",
						href: `${api.origin}/me#plan`
					} } : {},
					onClose: release
				});
				return;
			}
			knownAdded(username, {
				slug: res.slug,
				name: res.name || name
			});
			const sent = got.payload;
			const profileDetail = sent.access === "limited" ? "profile only" : [plural$1(sent.posts.length, "post"), sent.highlights.length ? plural$1(sent.highlights.length, "highlight") : ""].filter(Boolean).join(", ");
			const done = (chat) => {
				const failed = !chat.ok && !chat.skipped;
				panel.show({
					kind: "card",
					tone: "ok",
					icon: failed ? "warn" : "ok",
					title: failed ? "Her profile is in" : "Upload complete",
					text: [
						`RizzBot is ${res.created ? "importing" : "updating"} ${res.name || name || "her"} now.`,
						...got?.note ? [got.note] : [],
						...chat.why ? [chat.why] : []
					],
					checklist: [
						{
							label: "Her profile",
							detail: profileDetail,
							state: "done"
						},
						{
							label: "Your chat",
							detail: chat.detail,
							state: chat.ok ? "done" : chat.skipped ? "skipped" : "failed"
						},
						{
							label: res.created ? "Importing in RizzBot" : "Updating in RizzBot",
							state: "running"
						}
					],
					...chat.resync ? { buttons: [{
						label: "Resync all",
						quiet: true,
						icon: "sync",
						onClick: () => void syncChat(chat.resync, username, true)
					}] } : chat.retry ? { buttons: [{
						label: "Sync the chat again",
						quiet: true,
						icon: "sync",
						onClick: () => void syncChat(chat.retry, username)
					}] } : {},
					link: {
						label: "Open in RizzBot",
						icon: "open",
						first: true,
						href: `${api.origin}/chats/${encodeURIComponent(res.slug)}`
					},
					onClose: release
				});
			};
			let stop = false;
			let last = ["Finding your chat", CHAT_FROM];
			const showChat = (step, value, sending = false) => {
				last = [step, value];
				panel.show({
					kind: "card",
					title,
					text: [KEEP_OPEN],
					icon: "spin",
					progress: {
						value,
						step
					},
					buttons: sending ? [] : stop ? [{
						label: "Stopping",
						quiet: true,
						disabled: true,
						onClick: () => {}
					}] : [{
						label: "Stop",
						quiet: true,
						onClick: () => (stop = true, showChat(...last))
					}]
				});
			};
			let found = null;
			try {
				showChat("Finding your chat", CHAT_FROM);
				found = await findThread(sent.user, () => stop);
				if (!found.threadId) {
					if (found.complete) done({
						detail: "no chat found",
						ok: true,
						why: "If she wrote to you first, accept her message request on Instagram, then sync from the chat."
					});
					else done({
						detail: "not found",
						ok: false,
						skipped: true,
						why: NOT_IN_400
					});
					return;
				}
				const threadId = found.threadId;
				const r = await readAndSend(threadId, {
					full: false,
					stopped: () => stop,
					show: (step, f, sending) => showChat(step, CHAT_FROM + f * .5, sending)
				});
				const detail = res.created ? r.scanned ? plural$1(r.scanned, "message") : "no messages" : r.res.added ? plural$1(r.res.added, "new message") : "no new messages";
				if (r.capped) done({
					detail: `${detail}, the newest ${MAX_MESSAGES.toLocaleString("en-US")}`,
					ok: true
				});
				else if (r.truncated) done({
					detail: `${detail}, not all`,
					ok: false,
					skipped: true,
					resync: threadId
				});
				else done({
					detail,
					ok: true
				});
			} catch (e) {
				done(chatEndFor(e, found?.threadId ?? null));
			}
		}
		async function findThread(user, stopped) {
			const known = threadByHandle.get(user.username.toLowerCase());
			if (known) return {
				threadId: known,
				complete: true
			};
			return findThreadWith(user, {
				ig,
				sleep,
				...stopped ? { stopped } : {}
			});
		}
		async function syncFromPage(urlId) {
			held = true;
			let stop = false;
			const finding = () => panel.show({
				kind: "card",
				title: "Syncing your chat",
				text: ["Getting your newest messages."],
				icon: "spin",
				progress: {
					value: .03,
					step: "Finding this chat"
				},
				buttons: stop ? [{
					label: "Stopping",
					quiet: true,
					disabled: true,
					onClick: () => {}
				}] : [{
					label: "Stop",
					quiet: true,
					onClick: () => (stop = true, finding())
				}]
			});
			finding();
			try {
				const cached = host.get(threadKey(urlId), null);
				const threadId = typeof cached === "string" && /^\d{1,40}$/.test(cached) ? cached : await resolveThreadId(urlId, {
					ig,
					sleep,
					stopped: () => stop
				});
				if (threadId && threadId !== cached) host.set(threadKey(urlId), threadId);
				if (stop) throw new SyncStopped();
				if (!threadId) {
					panel.show({
						kind: "card",
						icon: "warn",
						title: "Could not find this chat",
						text: [NOT_IN_400],
						onClose: release
					});
					return;
				}
				await syncChat(threadId, void 0, false, urlId);
			} catch (e) {
				if (e instanceof SyncStopped) {
					panel.show({
						kind: "card",
						title: "Sync stopped",
						text: ["Nothing in RizzBot was changed."],
						onClose: release
					});
					return;
				}
				const message = e instanceof InstagramError ? e.message : "Something went wrong finding this chat. Reload it and try again.";
				const retry = !(e instanceof InstagramError) || e.kind === "failed";
				panel.show({
					kind: "card",
					icon: "error",
					tone: "error",
					title: "Could not sync the chat",
					text: [message],
					buttons: retry ? [{
						label: "Try again",
						primary: true,
						icon: "retry",
						onClick: () => void syncFromPage(urlId)
					}] : [],
					onClose: release
				});
			}
		}
		async function readAndSend(threadId, o) {
			const api = createApi(host);
			const ctx = o.ctx ?? { handle: "" };
			const pageAtStart = threadFromPath(win.location.pathname);
			let partial = false;
			o.show("Reading your messages", .05);
			let pages = 0;
			const { truncated, capped, reached, ...chat } = await collectChat(threadId, {
				ig,
				sleep,
				...o.stopped ? { stopped: o.stopped } : {},
				progress: (read, more, sinceMark) => {
					pages++;
					const what = sinceMark ? "new messages" : "your messages";
					o.show(more ? `Reading ${what} (${read} so far)` : sinceMark ? "Read the new messages" : `Read all ${read} messages`, more ? Math.min(.85, .1 + pages * .08) : .88);
				},
				markFor: async (her) => {
					ctx.handle = her.username;
					const q = `ig_id=${encodeURIComponent(her.id)}&username=${encodeURIComponent(her.username)}`;
					try {
						const r = await api.call("GET", `/api/girls/instagram-chat?${q}`, void 0, 2e4);
						if (r.first_merge && !await askMerge(r.name, r.first_merge.app, r.first_merge.turns)) throw new ChatSkipped();
						partial = !o.full && !!r.mark;
						return o.full ? null : r.mark ?? null;
					} catch (e) {
						if (e instanceof ApiError && e.status === 404) throw e;
						if (e instanceof ApiError || e instanceof NotConnectedError || e instanceof ChatSkipped) throw e;
						throw new ApiError("RizzBot could not be reached. Try again in a minute.", 0, null);
					}
				}
			});
			ctx.handle = chat.her.username;
			const decision = sendDecision({
				partial,
				reached,
				truncated
			});
			if (!decision.send) throw new ReadCutShort();
			partial = !decision.full;
			o.show("Sending your chat", .92, true);
			const res = await api.call("POST", "/api/girls/instagram-chat", { chat: {
				...chat,
				full: decision.full
			} }, 6e4);
			const now = Date.now();
			for (const id of new Set([
				threadId,
				o.pageId,
				pageAtStart
			])) if (id) host.set(syncedKey(id), now);
			return {
				res,
				partial,
				scanned: chat.messages.length,
				truncated,
				capped
			};
		}
		function askMerge(name, app, turns) {
			return new Promise((resolve) => {
				panel.show({
					kind: "card",
					keep: true,
					title: "Add your Instagram chat too?",
					text: [`${name} already has ${turns} ${turns === 1 ? "message" : "messages"} from ${appName(app)}. Your Instagram messages go after them.`],
					buttons: [{
						label: "Add after them",
						primary: true,
						icon: "plus",
						onClick: () => resolve(true)
					}, {
						label: "Skip chat",
						quiet: true,
						onClick: () => resolve(false)
					}],
					onClose: () => resolve(false)
				});
			});
		}
		async function syncChat(threadId, knownHandle, full = false, pageId) {
			held = true;
			const api = createApi(host);
			const ctx = { handle: knownHandle ?? "" };
			let stop = false;
			let last = [
				"Reading your messages",
				.05,
				false
			];
			const show = (step, value, sending = false) => {
				last = [
					step,
					value,
					sending
				];
				panel.show({
					kind: "card",
					title: "Syncing your chat",
					text: [full ? "Getting your whole chat." : "Getting your newest messages.", KEEP_OPEN],
					icon: "spin",
					progress: {
						value,
						step
					},
					buttons: sending ? [] : stop ? [{
						label: "Stopping",
						quiet: true,
						disabled: true,
						onClick: () => {}
					}] : [{
						label: "Stop",
						quiet: true,
						onClick: () => (stop = true, show(...last))
					}]
				});
			};
			try {
				const { res, partial, truncated, capped } = await readAndSend(threadId, {
					full,
					pageId,
					show,
					ctx,
					stopped: () => stop
				});
				const resync = [{
					label: "Resync all",
					quiet: true,
					icon: "sync",
					onClick: () => void syncChat(threadId, ctx.handle, true, pageId)
				}];
				panel.show({
					kind: "card",
					tone: "ok",
					icon: truncated && !capped ? "warn" : "ok",
					title: res.added ? "Chat synced" : truncated && !capped ? "Chat read in part" : "Already up to date",
					...res.added ? { count: {
						value: res.added,
						label: res.added === 1 ? "new message" : "new messages"
					} } : {},
					text: capped ? [`RizzBot has the newest ${MAX_MESSAGES.toLocaleString("en-US")} messages of this chat. One sync reads no further back.`] : truncated ? ["Instagram stopped the read early, so older messages may be missing. Resync all to read the rest."] : res.added ? [] : ["RizzBot has every message."],
					buttons: (partial || truncated) && !capped ? resync : [],
					link: {
						label: "Open in RizzBot",
						icon: "open",
						first: true,
						href: `${api.origin}/chats/${encodeURIComponent(res.slug)}`
					},
					onClose: release
				});
			} catch (e) {
				if (e instanceof ChatSkipped || e instanceof SyncStopped) {
					panel.show({
						kind: "card",
						title: e instanceof SyncStopped ? "Sync stopped" : "Chat not synced",
						text: ["Nothing in RizzBot was changed."],
						onClose: release
					});
					return;
				}
				if (e instanceof ReadCutShort) {
					panel.show({
						kind: "card",
						icon: "warn",
						title: "Chat read in part",
						text: ["Instagram stopped the read before it reached what RizzBot has, so nothing was sent. Resync all reads it from the start."],
						buttons: [{
							label: "Resync all",
							primary: true,
							icon: "sync",
							onClick: () => void syncChat(threadId, ctx.handle, true, pageId)
						}],
						onClose: release
					});
					return;
				}
				const needsProfile = e instanceof ApiError && e.status === 404 && e.body?.needs_profile === true;
				const said = e instanceof ApiError && typeof e.body?.username === "string" ? e.body.username : ctx.handle;
				const who = /^[a-z0-9._]{1,30}$/i.test(said ?? "") ? said : "";
				if (needsProfile && who) {
					panel.show({
						kind: "card",
						icon: "warn",
						title: `Add @${who} first`,
						text: ["Add her from her profile. Her chat comes with her."],
						buttons: [{
							label: "Open her profile",
							primary: true,
							icon: "user",
							onClick: () => win.location.assign(`/${who}/`)
						}],
						onClose: release
					});
					return;
				}
				if (e instanceof NotConnectedError || e instanceof ApiError && e.status === 401) return showConnect();
				if (e instanceof ApiError && e.status === 409 && e.body?.gap === true) {
					panel.show({
						kind: "card",
						icon: "warn",
						title: "Chat read in part",
						text: [e.message],
						buttons: [{
							label: "Resync all",
							primary: true,
							icon: "sync",
							onClick: () => void syncChat(threadId, ctx.handle, true, pageId)
						}],
						onClose: release
					});
					return;
				}
				const message = e instanceof ApiError || e instanceof InstagramError || e instanceof GroupChatError ? e.message : "Something went wrong reading the chat. Reload it and try again.";
				const status = e instanceof ApiError ? e.status : 0;
				const retry = !(e instanceof GroupChatError) && !(e instanceof InstagramError && e.kind !== "failed") && status !== 402 && status !== 413;
				panel.show({
					kind: "card",
					icon: "error",
					tone: "error",
					title: "Could not sync the chat",
					text: [message],
					buttons: retry ? [{
						label: "Try again",
						primary: true,
						icon: "retry",
						onClick: () => void syncChat(threadId, ctx.handle, full, pageId)
					}] : [],
					...status === 402 ? { link: {
						label: "See your plan",
						icon: "open",
						href: `${createApi(host).origin}/me#plan`
					} } : {},
					onClose: release
				});
			}
		}
		const onReady = () => {
			refresh();
			onUrlChange$1(win, () => {
				profileSince = Date.now();
				if (!panel.isWorking()) held = false;
				refresh();
				win.setTimeout(refresh, 6100);
			});
			win.setTimeout(refresh, 6100);
			win.addEventListener("focus", () => {
				if (askingToConnect && createApi(host).connected()) {
					askingToConnect = false;
					release();
				} else refresh();
			});
		};
		if (win.document.readyState === "loading") win.document.addEventListener("DOMContentLoaded", onReady, { once: true });
		else onReady();
	}
	function plural$1(n, word) {
		return `${n} ${word}${n === 1 ? "" : "s"}`;
	}
	function safe(f) {
		try {
			return f();
		} catch {
			return null;
		}
	}
	var DEFAULT_STYLE = "position:absolute;top:6px;right:6px;z-index:5;pointer-events:auto";
	var CSS = `
:host { all: initial; }
.chip {
  display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 8px 0 6px; border: 0; border-radius: 999px;
  background: rgb(9 9 11 / .86); color: #f4f4f6;
  font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  white-space: nowrap; -webkit-font-smoothing: antialiased; box-shadow: 0 1px 3px rgb(0 0 0 / .35);
}
button.chip { cursor: pointer; transition: filter .15s; }
button.chip:hover { filter: brightness(1.25); }
button.chip:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }
.dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
.grey .dot { background: #a1a1aa; }
.green .dot { background: #22c55e; }
.blue .dot { background: #3b82f6; }
.amber .dot { background: #f59e0b; }
.red .dot { background: #ef4444; }
.muted { color: #a1a1aa; }
.muted .dot { background: #52525b; }
.spin { width: 8px; height: 8px; border: 2px solid rgb(59 130 246 / .3); border-top-color: #3b82f6; border-radius: 50%; animation: s .8s linear infinite; flex: none; }
@keyframes s { to { transform: rotate(360deg); } }
.ring { position: absolute; inset: -4px; border: 3px solid var(--c); border-radius: calc(var(--r) + 4px); box-sizing: border-box; pointer-events: none; }
.ring.in { inset: 0; border-radius: var(--r); }
.ring.dash { border-style: dashed; }
.chip.mini {
  position: absolute; right: var(--k); bottom: var(--k); width: 24px; height: 24px; padding: 0; gap: 0; justify-content: center;
  border-radius: 50%; background: var(--c); color: #fff; border: 3px solid var(--bg); box-sizing: border-box; pointer-events: auto; box-shadow: none;
}
.chip.mini svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.chip.mini .spin { width: 9px; height: 9px; border-color: rgb(255 255 255 / .35); border-top-color: #fff; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;
	var TONE = {
		green: "#22c55e",
		rose: "#f43f5e",
		blue: "#3b82f6",
		amber: "#f59e0b",
		red: "#ef4444",
		muted: "#6b7078",
		grey: "#a1a1aa"
	};
	var ICON = {
		check: ["M20 6 9 17l-5-5"],
		plus: ["M12 5v14", "M5 12h14"],
		down: ["M12 5v14", "m19 12-7 7-7-7"],
		alert: ["M12 8v5", "M12 17h.01"],
		chat: ["M7.9 20A9 9 0 1 0 4 16.1L2 22z"],
		clock: ["M12 7v5l3 2"]
	};
	var SVG_NS = "http://www.w3.org/2000/svg";
	var Marks = class {
		doc;
		find;
		specs = new Map();
		live = new WeakMap();
		hosts = new Set();
		observer = null;
		pending = null;
		constructor(doc, find) {
			this.doc = doc;
			this.find = find;
		}
		watch() {
			const win = this.doc.defaultView;
			if (this.observer || !win) return;
			const MO = win.MutationObserver;
			if (MO) {
				this.observer = new MO((records) => {
					for (const r of records) {
						if (r.type === "attributes") return this.schedule();
						for (const n of Array.from(r.addedNodes).concat(Array.from(r.removedNodes))) if (!this.hosts.has(n)) return this.schedule();
					}
				});
				this.observer.observe(this.doc.documentElement, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ["href"]
				});
			}
			win.addEventListener("resize", () => this.schedule());
			this.apply();
		}
		stop() {
			this.observer?.disconnect();
			this.observer = null;
			const win = this.doc.defaultView;
			if (this.pending !== null && win) win.clearTimeout(this.pending);
			this.pending = null;
			this.specs.clear();
			for (const h of this.hosts) h.remove();
			this.hosts.clear();
		}
		set(id, spec) {
			if (spec) this.specs.set(id, spec);
			else this.specs.delete(id);
			this.schedule();
		}
		ids() {
			return Array.from(this.specs.keys());
		}
		schedule() {
			if (!this.observer) return;
			const win = this.doc.defaultView;
			if (!win) return this.apply();
			if (this.pending !== null) return;
			this.pending = win.setTimeout(() => {
				this.pending = null;
				this.apply();
			}, 60);
		}
		apply() {
			let targets = [];
			try {
				targets = this.find();
			} catch {}
			const keep = new Set();
			for (const t of targets) {
				const spec = this.specs.get(t.id);
				if (!spec || !t.node.isConnected) continue;
				const live = this.chipFor(t.node);
				keep.add(live.host);
				const style = t.style ?? DEFAULT_STYLE;
				if (live.host.getAttribute("style") !== style) live.host.setAttribute("style", style);
				if (live.host.parentElement !== t.node || live.host !== t.node.lastElementChild) t.node.appendChild(live.host);
				this.draw(live, spec, t.ring);
			}
			for (const h of Array.from(this.hosts)) {
				if (keep.has(h)) continue;
				if (h.isConnected) h.remove();
				this.hosts.delete(h);
			}
		}
		chipFor(node) {
			const had = this.live.get(node);
			if (had) {
				this.hosts.add(had.host);
				return had;
			}
			const host = this.doc.createElement("rizzbot-connect-mark");
			const root = closedShadow(host);
			const style = this.doc.createElement("style");
			style.textContent = CSS;
			root.appendChild(style);
			const wrap = this.doc.createElement("span");
			root.appendChild(wrap);
			const live = {
				host,
				wrap,
				sig: "",
				click: void 0
			};
			this.live.set(node, live);
			this.hosts.add(host);
			return live;
		}
		draw(live, spec, ring) {
			live.click = spec.onClick;
			const sig = signatureOf([
				spec.label,
				spec.tone,
				spec.title ?? "",
				!!spec.busy,
				!!spec.onClick,
				spec.icon ?? "",
				!!spec.dashed,
				ring ? [
					ring.radius,
					!!ring.inset,
					ring.bg ?? "",
					ring.corner ?? -3
				] : null
			]);
			if (sig === live.sig) return;
			live.sig = sig;
			const chip = this.doc.createElement(spec.onClick ? "button" : "span");
			const parts = [];
			if (ring) {
				const r = this.doc.createElement("span");
				r.className = `ring${ring.inset ? " in" : ""}${spec.dashed ? " dash" : ""}`;
				parts.push(r);
				chip.className = `chip mini ${spec.tone}`;
				if (spec.busy) {
					const sp = this.doc.createElement("span");
					sp.className = "spin";
					chip.appendChild(sp);
				} else if (spec.icon) {
					const svg = this.doc.createElementNS(SVG_NS, "svg");
					svg.setAttribute("viewBox", "0 0 24 24");
					svg.setAttribute("aria-hidden", "true");
					for (const d of ICON[spec.icon]) {
						const path = this.doc.createElementNS(SVG_NS, "path");
						path.setAttribute("d", d);
						svg.appendChild(path);
					}
					chip.appendChild(svg);
				}
				const sr = this.doc.createElement("span");
				sr.className = "sr";
				sr.textContent = spec.label;
				chip.appendChild(sr);
				live.wrap.setAttribute("style", `position:absolute;inset:0;--c:${TONE[spec.tone]};--r:${Math.max(0, ring.radius)}px;--bg:${ring.bg ?? "#111"};--k:${ring.inset ? 5 : ring.corner ?? -3}px`);
			} else {
				live.wrap.removeAttribute("style");
				chip.className = `chip ${spec.tone}`;
				const dot = this.doc.createElement("span");
				dot.className = spec.busy ? "spin" : "dot";
				chip.appendChild(dot);
				const text = this.doc.createElement("span");
				text.textContent = spec.label;
				chip.appendChild(text);
			}
			chip.title = spec.title ? `${spec.label}. ${spec.title}` : spec.label;
			if (!ring) chip.title = spec.title ?? "";
			if (!ring && !spec.title) chip.removeAttribute("title");
			if (spec.onClick) {
				chip.type = "button";
				const stop = (e) => {
					e.preventDefault();
					e.stopPropagation();
				};
				chip.addEventListener("pointerdown", (e) => e.stopPropagation());
				chip.addEventListener("mousedown", (e) => e.stopPropagation());
				chip.addEventListener("click", (e) => {
					stop(e);
					live.click?.();
				});
			}
			live.wrap.replaceChildren(...parts, chip);
		}
	};
	var HEX24 = /^[0-9a-f]{24}$/;
	var HEX48 = /^[0-9a-f]{48}$/;
	var MAX_UPDATES = 40;
	var MAX_HISTORY = 2e3;
	var MAX_BATCH = 400;
	var MAX_TEXT = 1e4;
	var cut = (t) => t !== null && t.length > MAX_TEXT ? t.slice(0, MAX_TEXT) : t;
	function kindOf(k) {
		return k.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().replace(/[^a-z_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 24) || "other";
	}
	var obj = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : null;
	var str = (v) => typeof v === "string" && v ? v : null;
	var arr = (v) => Array.isArray(v) ? v : [];
	var idOf = (o) => o ? str(o._id) ?? str(o.id) : null;
	function legacyId(id) {
		const m = /([0-9a-f]{24})$/i.exec(typeof id === "string" ? id : "");
		return m ? m[1].toLowerCase() : null;
	}
	function fromLegacy(m) {
		const o = obj(m);
		if (!o) return null;
		const text = cut(typeof o.message === "string" ? o.message : null);
		const id = legacyId(idOf(o));
		if (!id && text === null) return null;
		const type = str(o.type);
		return {
			id,
			sender: str(o.from),
			at: str(o.sent_date) ?? str(o.created_date),
			text,
			kind: type === "gif" ? "gif" : text !== null ? "text" : kindOf(type ?? "other")
		};
	}
	function fromChannel(m) {
		const o = obj(m);
		if (!o) return null;
		const mid = obj(o.message_id);
		const id = legacyId(mid ? mid.id : o.message_id);
		const content = obj(o.content) ?? {};
		const t = content.text;
		let text = null;
		let kind = kindOf(Object.keys(content)[0] ?? "other");
		if (typeof t === "string") text = cut(t);
		else if (obj(t) && typeof obj(t).message === "string") text = cut(obj(t).message);
		if (text !== null) kind = "text";
		else if (kind === "text") kind = "other";
		else if (obj(content.gif)) {
			kind = "gif";
			text = str(obj(content.gif).url);
		}
		if (!id && text === null) return null;
		return {
			id,
			sender: str(o.sender_id),
			at: str(o.created_at),
			text,
			kind
		};
	}
	function richness(u) {
		let n = 0;
		if (arr(u.selected_descriptors).length) n += 10;
		if (u.user_prompts || u.profile_prompts) n += 4;
		if (u.city) n += 2;
		if (arr(u.jobs).length) n += 2;
		if (arr(u.schools).length) n += 2;
		if (u.user_interests) n += 2;
		if ("distance_mi" in u) n += 1;
		if (u.bio) n += 1;
		return n;
	}
	function looksLikeUser(o) {
		return !!o && !!idOf(o) && Array.isArray(o.photos) && !!(o.name || o.bio || o.birth_date);
	}
	var byTime = (a, b) => (Date.parse(a.at ?? "") || 0) - (Date.parse(b.at ?? "") || 0);
	var msgKey = (m) => m.id ?? `${m.at}|${m.sender}|${m.text}`;
	var TinderCapture = class {
		selfId = null;
		version = 0;
		matches = new Map();
		users = new Map();
		fullProfile = new Set();
		complete = {
			messages: false,
			new: false
		};
		chain = {
			id: 0,
			last: null,
			start: null
		};
		rec(matchId) {
			let r = this.matches.get(matchId);
			if (!r) {
				r = {
					matchId,
					personId: null,
					name: null,
					createdDate: null,
					raw: null,
					listed: null,
					listNewest: null,
					updates: [],
					history: null,
					historyComplete: false,
					historyTruncated: false,
					group: false,
					version: 0
				};
				this.matches.set(matchId, r);
			}
			return r;
		}
		bump(r) {
			if (r) r.version++;
			this.version++;
		}
		person(r, p) {
			if (!p) return;
			const id = idOf(p);
			if (id && HEX24.test(id) && !r.personId) r.personId = id;
			if (!r.name && str(p.name)) r.name = str(p.name);
			if (looksLikeUser(p)) this.storeUser(p);
		}
		storeUser(u) {
			const id = idOf(u);
			const had = this.users.get(id);
			if (!had || richness(u) >= richness(had)) this.users.set(id, u);
		}
		ingest(path, query, json, requestBody) {
			const top = obj(json);
			if (!top) return;
			const d = obj(top.data) ?? top;
			if (path === "/v2/profile") {
				const id = idOf(obj(d.user));
				if (id && HEX24.test(id) && id !== this.selfId) {
					this.selfId = id;
					this.bump(null);
				}
				return;
			}
			if (path === "/v2/matches") return this.onList(d, query.get("message") === "0" ? "new" : "messages");
			if (path === "/updates") return this.onUpdates(d, str(obj(requestBody)?.last_activity_date), str(top.last_activity_date) ?? str(d.last_activity_date));
			if (path === "/v1/chat/channels/query") return this.onChannels(d);
			if (path === "/v1/chat/channels/messages/query") return this.onHistory(d, obj(requestBody));
			if (path.startsWith("/user/matches/")) return this.onSent(path.slice(14), d);
			if (path.startsWith("/user/")) {
				const u = obj(top.results) ?? obj(d.results) ?? obj(d.user) ?? d;
				if (looksLikeUser(u) && idOf(u) === path.slice(6)) {
					this.storeUser(u);
					this.fullProfile.add(idOf(u));
					this.bump(null);
				}
			}
		}
		onList(d, kind) {
			for (const m of arr(d.matches)) {
				const o = obj(m);
				const id = idOf(o);
				if (!o || !id || !HEX48.test(id)) continue;
				const r = this.rec(id);
				if (o.type === "group_match") r.group = true;
				r.raw = o;
				r.listed = kind;
				r.createdDate = str(o.created_date) ?? r.createdDate;
				this.person(r, obj(o.person));
				const msgs = arr(o.messages).map(fromLegacy).filter((x) => !!x).sort(byTime);
				if (msgs.length) r.listNewest = msgs[msgs.length - 1];
				this.bump(r);
			}
			if (!str(d.next_page_token)) this.complete[kind] = true;
		}
		onUpdates(d, cutoff, answeredTo) {
			const same = (a, b) => !!a && !!b && Date.parse(a) === Date.parse(b) && Number.isFinite(Date.parse(a));
			if (!same(cutoff, this.chain.last)) {
				this.chain.id++;
				this.chain.start = cutoff;
			}
			this.chain.last = answeredTo;
			const chain = this.chain.id;
			const since = this.chain.start;
			for (const m of arr(d.matches)) {
				const o = obj(m);
				const id = idOf(o);
				if (!o || !id || !HEX48.test(id)) continue;
				const msgs = arr(o.messages).map(fromLegacy).filter((x) => !!x).sort(byTime);
				const r = this.rec(id);
				this.person(r, obj(o.person));
				if (!msgs.length) continue;
				this.pushBatch(r, {
					cutoff: since,
					messages: msgs,
					chain
				});
				this.bump(r);
			}
		}
		onChannels(d) {
			for (const c of arr(d.channels)) {
				const o = obj(c);
				const mid = str(obj(o?.channel_id)?.reference_id);
				if (!o || !mid || !HEX48.test(mid)) continue;
				const r = this.rec(mid);
				const parts = arr(o.participants).map(obj).filter(Boolean);
				if (parts.length > 1) r.group = true;
				const p = parts[0];
				if (p) {
					const pid = str(p.user_id);
					if (pid && HEX24.test(pid) && !r.personId) r.personId = pid;
					if (!r.name && str(p.name)) r.name = str(p.name);
				}
				const created = str(obj(o.match)?.created_at);
				if (created && !r.createdDate) r.createdDate = created;
				this.bump(r);
			}
		}
		onHistory(d, req) {
			const mid = str(obj(obj(d.channel)?.channel_id)?.reference_id) ?? str(obj(req?.channel_id)?.reference_id);
			if (!mid || !HEX48.test(mid)) return;
			const r = this.rec(mid);
			const parts = arr(obj(d.channel)?.participants).map(obj).filter(Boolean);
			if (parts.length > 1) r.group = true;
			if (parts[0] && !r.personId && HEX24.test(str(parts[0].user_id) ?? "")) r.personId = str(parts[0].user_id);
			if (parts[0] && !r.name) r.name = str(parts[0].name);
			r.history ??= new Map();
			for (const m of arr(d.messages)) {
				const x = fromChannel(m);
				if (!x) continue;
				if (r.history.has(msgKey(x)) || r.history.size < MAX_HISTORY) r.history.set(msgKey(x), x);
				else r.historyTruncated = true;
			}
			if (obj(d.pagination_info)?.has_next_page === false) r.historyComplete = true;
			this.bump(r);
		}
		onSent(matchId, d) {
			if (!HEX48.test(matchId)) return;
			const x = fromLegacy(d);
			if (!x) return;
			const r = this.rec(matchId);
			this.pushBatch(r, {
				cutoff: null,
				messages: [x],
				send: true
			});
			this.bump(r);
		}
		pushBatch(r, b) {
			const same = b.chain === void 0 ? void 0 : [...r.updates].reverse().find((u) => u.chain === b.chain && !u.send);
			if (same) {
				const all = new Map();
				for (const m of [...same.messages, ...b.messages]) all.set(msgKey(m), m);
				same.messages = [...all.values()].sort(byTime);
				if (same.messages.length > MAX_BATCH) {
					same.messages = same.messages.slice(-400);
					same.cutoff = null;
				}
				return;
			}
			if (b.messages.length > MAX_BATCH) b = {
				...b,
				messages: b.messages.slice(-400),
				cutoff: null
			};
			r.updates.push(b);
			while (r.updates.length > MAX_UPDATES) {
				const send = r.updates.findIndex((u) => u.send);
				if (send >= 0) {
					r.updates.splice(send, 1);
					continue;
				}
				r.updates.shift();
			}
		}
		listsComplete() {
			return this.complete.messages && this.complete.new;
		}
		matchIds() {
			return [...this.matches.values()].filter((r) => !r.group).map((r) => r.matchId);
		}
		isGroup(matchId) {
			return !!this.matches.get(matchId)?.group;
		}
		matchVersion(matchId) {
			return this.matches.get(matchId)?.version ?? 0;
		}
		listedAs(matchId) {
			return this.matches.get(matchId)?.listed ?? null;
		}
		nameOf(matchId) {
			return this.matches.get(matchId)?.name ?? null;
		}
		hasFullProfile(matchId) {
			const p = this.matches.get(matchId)?.personId;
			return !!p && this.fullProfile.has(p);
		}
		side(r, sender) {
			if (!sender) return null;
			if (r.personId) return sender === r.personId ? "her" : "him";
			if (this.selfId) return sender === this.selfId ? "him" : "her";
			return null;
		}
		wire(r, m) {
			if (!m) return null;
			if (!m.sender && (r.personId || this.selfId)) return null;
			const from = this.side(r, m.sender);
			if (!from) return void 0;
			return {
				id: m.id,
				from,
				at: m.at,
				text: m.text,
				kind: m.kind
			};
		}
		evidence(matchId) {
			const r = this.matches.get(matchId);
			if (!r || r.group) return null;
			const listNewest = this.wire(r, r.listNewest);
			if (listNewest === void 0) return null;
			const updates = [];
			for (const u of r.updates) {
				const messages = u.messages.filter((m) => m.sender || !(r.personId || this.selfId)).map((m) => this.wire(r, m));
				if (messages.some((m) => !m)) return null;
				if (messages.length) updates.push({
					cutoff: u.cutoff,
					messages
				});
			}
			let history = null;
			if (r.history) {
				const messages = [...r.history.values()].filter((m) => m.sender || !(r.personId || this.selfId)).sort(byTime).map((m) => this.wire(r, m));
				if (messages.some((m) => !m)) return null;
				history = {
					messages,
					morePages: !r.historyComplete || r.historyTruncated
				};
			}
			return {
				matchId: r.matchId,
				personId: r.personId,
				name: r.name,
				listNewest,
				updates,
				history
			};
		}
		importPayload(matchId, panel, now = new Date()) {
			const r = this.matches.get(matchId);
			if (!r || r.group || !r.personId) return null;
			const user = this.users.get(r.personId) ?? null;
			const match = r.raw ?? {
				_id: r.matchId,
				...r.createdDate ? { created_date: r.createdDate } : {},
				...user ? { person: user } : {}
			};
			const all = new Map();
			const add = (m) => m && all.set(msgKey(m), m);
			add(r.listNewest);
			for (const u of r.updates) u.messages.forEach(add);
			for (const m of r.history?.values() ?? []) add(m);
			const messages = [...all.values()].sort(byTime).map((m) => ({
				...m.id ? { _id: m.id } : {},
				match_id: r.matchId,
				from: m.sender,
				...m.at ? { sent_date: m.at } : {},
				message: m.text ?? `[${m.kind}]`,
				...m.kind !== "text" ? { type: m.kind } : {}
			}));
			return {
				__rizzbot_tinder__: 1,
				version: "connect-1",
				source: "rizzbot-connect",
				capturedAt: now.toISOString(),
				matchId: r.matchId,
				selfUserId: this.selfId,
				match,
				user: user ?? obj(match.person),
				messages,
				panel
			};
		}
	};
	function matchFromPath(pathname) {
		const m = /^\/app\/messages\/([0-9a-f]{48})\/?$/.exec(pathname);
		return m ? m[1] : null;
	}
	var KINDS = new Set([
		"not-imported",
		"synced",
		"outdated",
		"mismatch",
		"moved-off",
		"busy"
	]);
	function readBadge(v) {
		if (!v || typeof v !== "object") return null;
		const o = v;
		if (typeof o.kind !== "string" || !KINDS.has(o.kind)) return null;
		const b = { kind: o.kind };
		if (typeof o.slug === "string" && o.slug) b.slug = o.slug;
		if (typeof o.name === "string" && o.name) b.name = o.name;
		if (typeof o.added === "number" && o.added > 0) b.added = Math.floor(o.added);
		if (typeof o.why === "string" && o.why) b.why = o.why;
		if (typeof o.platform === "string" && o.platform) b.platform = o.platform;
		return b;
	}
	var APP = {
		whatsapp: "WhatsApp",
		instagram: "Instagram",
		imessage: "iMessage"
	};
	function chipFor(b, s) {
		if (s.importing) return {
			spec: {
				label: "Importing",
				tone: "blue",
				busy: true,
				icon: "plus",
				title: "RizzBot is importing her."
			},
			action: null
		};
		if (!b) return null;
		if (s.syncing && (b.kind === "synced" || b.kind === "outdated" || b.kind === "busy")) return {
			spec: {
				label: "Syncing",
				tone: "blue",
				busy: true,
				icon: "check",
				title: "Sending her newest messages to RizzBot."
			},
			action: null
		};
		switch (b.kind) {
			case "not-imported": return {
				spec: {
					label: "Import",
					tone: "rose",
					icon: "plus",
					dashed: true,
					title: "Not in RizzBot yet. Open her, then press Import."
				},
				action: "import"
			};
			case "synced": return {
				spec: {
					label: s.tile ? "In RizzBot" : "Synced",
					tone: "green",
					icon: "check",
					title: b.added ? `${capital(plural(b.added, "new message"))} added to RizzBot. Press to open her there.` : "RizzBot has every message. Press to open her there."
				},
				action: b.slug ? "open" : null
			};
			case "outdated": return {
				spec: {
					label: "Outdated",
					tone: "amber",
					icon: "down",
					title: b.why ?? "Tinder has messages RizzBot does not. Open her chat to sync them."
				},
				action: null
			};
			case "mismatch": return {
				spec: {
					label: "Mismatch",
					tone: "red",
					icon: "alert",
					title: `${b.why ?? "RizzBot and Tinder disagree about her chat."} Press to review it in RizzBot.`
				},
				action: b.slug ? "review" : null
			};
			case "moved-off": return {
				spec: {
					label: `On ${APP[b.platform ?? ""] ?? "another app"}`,
					tone: "muted",
					icon: "chat",
					title: "Her chat moved off Tinder, so RizzBot Connect leaves it alone."
				},
				action: b.slug ? "open" : null
			};
			case "busy": return {
				spec: {
					label: "Busy",
					tone: "muted",
					icon: "clock",
					title: `${b.why ?? "Something is running for her in RizzBot. Her chat syncs once it ends."}${b.slug ? " Press to open her in RizzBot." : ""}`
				},
				action: b.slug ? "open" : null
			};
		}
	}
	function girlUrl(origin, slug, review = false) {
		return `${origin}/chats/${encodeURIComponent(slug)}${review ? "?review=tinder" : ""}`;
	}
	function pillFor(s) {
		if (!s.connected) return { kind: "connect" };
		if (!s.onHerChat || s.group) return { kind: "hidden" };
		const name = s.name ?? "her";
		if (s.importing) return {
			kind: "importing",
			name,
			slug: s.importing.slug
		};
		if (!s.badge) return { kind: "checking" };
		if (s.badge.kind === "not-imported") return s.fullProfile || s.graceOver ? {
			kind: "import",
			name
		} : {
			kind: "reading",
			name
		};
		if (s.badge.slug) return {
			kind: "in",
			name: s.badge.name ?? name,
			slug: s.badge.slug
		};
		return { kind: "hidden" };
	}
	function importGate(s) {
		return s.openMatch === s.matchId ? "go" : "open-her-first";
	}
	function toSend(s) {
		return s.ids.filter((id) => {
			if (s.version(id) !== s.sent.get(id)) return true;
			return s.busyRetry && s.badges.get(id)?.kind === "busy";
		});
	}
	function importEnd(status, body, message) {
		if (status >= 200 && status < 300 && typeof body?.slug === "string") return {
			kind: "started",
			slug: body.slug
		};
		if (status === 409 && body?.exists === true && typeof body.slug === "string") return {
			kind: "exists",
			slug: body.slug,
			name: typeof body.name === "string" ? body.name : body.slug
		};
		if (status === 401) return { kind: "connect" };
		if (status === 402) return {
			kind: "plan",
			message
		};
		return {
			kind: "failed",
			message,
			retry: !(status === 400 || status === 413)
		};
	}
	var capital = (t) => t.charAt(0).toUpperCase() + t.slice(1);
	function plural(n, word) {
		return `${n === 0 ? "no" : n} ${word}${n === 1 ? "" : "s"}`;
	}
	var MAX_BODY = 8388608;
	var PATHS = [
		/^\/v2\/matches$/,
		/^\/updates$/,
		/^\/v1\/chat\/channels\/query$/,
		/^\/v1\/chat\/channels\/messages\/query$/,
		/^\/user\/[0-9a-f]{24}$/,
		/^\/v2\/profile$/,
		/^\/user\/matches\/[0-9a-f]{48}$/
	];
	function apiTarget(url) {
		try {
			const u = new URL(url);
			if (u.origin !== "https://api.gotinder.com") return null;
			return PATHS.some((p) => p.test(u.pathname)) ? {
				path: u.pathname,
				query: u.searchParams
			} : null;
		} catch {
			return null;
		}
	}
	function readBody(body) {
		if (typeof body !== "string" || body.length > 65536) return null;
		try {
			return parseJson(body);
		} catch {
			return null;
		}
	}
	function parseAnswer(text) {
		if (!text || text.length > MAX_BODY) return null;
		try {
			return parseJson(text);
		} catch {
			return null;
		}
	}
	var INSTALLED = new WeakSet();
	function installHooks(win, sink) {
		if (INSTALLED.has(win)) return;
		INSTALLED.add(win);
		const deliver = (url, text, requestBody) => {
			const t = apiTarget(url);
			if (!t) return;
			const json = parseAnswer(text);
			if (json === null) return;
			try {
				sink(t.path, t.query, json, requestBody);
			} catch {}
		};
		const origFetch = win.fetch.bind(win);
		win.fetch = function(input, init) {
			const p = origFetch(input, init);
			let requestUrl = "";
			let requestBody = null;
			try {
				requestUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
				if (apiTarget(requestUrl)) requestBody = readBody(init?.body);
			} catch {}
			p.then((resp) => {
				try {
					const url = resp.url || requestUrl;
					if (apiTarget(url)) resp.clone().text().then((t) => deliver(url, t, requestBody), () => {});
				} catch {}
			}, () => {});
			return p;
		};
		const XHR = win.XMLHttpRequest.prototype;
		const open = XHR.open;
		const send = XHR.send;
		const urls = new WeakMap();
		XHR.open = function(...args) {
			try {
				urls.set(this, new URL(String(args[1] ?? ""), win.location.href).href);
			} catch {
				urls.set(this, String(args[1] ?? ""));
			}
			return open.apply(this, args);
		};
		XHR.send = function(...args) {
			const url = urls.get(this) ?? "";
			if (apiTarget(url)) {
				const requestBody = readBody(args[0]);
				this.addEventListener("load", () => {
					try {
						if (this.responseType === "" || this.responseType === "text") deliver(url, this.responseText, requestBody);
					} catch {}
				});
			}
			return send.apply(this, args);
		};
	}
	var ROW = /^\/app\/messages\/([0-9a-f]{48})\/?$/;
	function matchOfLink(a, base) {
		const href = a.getAttribute("href");
		if (!href) return null;
		try {
			const m = ROW.exec(new URL(href, base).pathname);
			return m ? m[1] : null;
		} catch {
			return null;
		}
	}
	var ROW_STYLE = "position:absolute;top:2px;right:10px;z-index:5;pointer-events:auto";
	var TILE_STYLE = "position:absolute;top:6px;right:6px;z-index:5;pointer-events:auto";
	var TILE_REACH = 8;
	var CHECKED = new WeakSet();
	var AVATAR = new WeakMap();
	var LOOK = new WeakMap();
	function positioned(el, view) {
		if (CHECKED.has(el)) return;
		CHECKED.add(el);
		const h = el;
		if (view.getComputedStyle(h).position === "static" && h.style.position !== "relative") h.style.position = "relative";
	}
	function radiusOf(el, view, width) {
		const r = view.getComputedStyle(el).borderTopLeftRadius || "0";
		const n = parseFloat(r);
		if (!Number.isFinite(n)) return 0;
		return r.trim().endsWith("%") ? width * n / 100 : n;
	}
	function backgroundOf(el, view) {
		for (let n = el; n; n = n.parentElement) {
			const c = view.getComputedStyle(n).backgroundColor;
			if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
		}
		return "#111418";
	}
	function avatarOf(row, view) {
		const had = AVATAR.get(row);
		if (had && had.isConnected && row.contains(had)) return had;
		let best = null;
		let bestW = 0;
		for (const el of Array.from(row.querySelectorAll("*"))) {
			const b = el.getBoundingClientRect();
			if (b.width < 36 || b.width > 140 || Math.abs(b.width - b.height) > 3 || b.width <= bestW) continue;
			if (radiusOf(el, view, b.width) < b.width * .4) continue;
			best = el;
			bestW = b.width;
		}
		if (best) AVATAR.set(row, best);
		return best;
	}
	var CLIPS = /^(hidden|auto|scroll|clip|overlay)$/;
	function clipperOf(el, view) {
		for (let n = el.parentElement; n && n !== el.ownerDocument.body; n = n.parentElement) {
			const cs = view.getComputedStyle(n);
			if (CLIPS.test(cs.overflowX) || CLIPS.test(cs.overflowY)) return n;
		}
		return null;
	}
	var px = (n) => `${Math.round(n * 10) / 10}px`;
	var boxStyle = (box, mount, m) => `position:absolute;left:${px(box.left - mount.left - m.clientLeft)};top:${px(box.top - mount.top - m.clientTop)};width:${px(box.width)};height:${px(box.height)};z-index:5;pointer-events:none`;
	function rowTargets(doc) {
		const out = [];
		const base = doc.location?.href ?? "https://tinder.com/";
		const view = doc.defaultView;
		for (const a of Array.from(doc.querySelectorAll("a.messageListItem"))) {
			const id = matchOfLink(a, base);
			if (!id || !view) continue;
			positioned(a, view);
			const av = avatarOf(a, view);
			if (!av) {
				out.push({
					id,
					node: a,
					style: ROW_STYLE
				});
				continue;
			}
			const box = av.getBoundingClientRect();
			let look = LOOK.get(av);
			if (!look) LOOK.set(av, look = {
				radius: radiusOf(av, view, box.width),
				bg: backgroundOf(a, view),
				clip: null
			});
			out.push({
				id,
				node: a,
				style: boxStyle(box, a.getBoundingClientRect(), a),
				ring: {
					radius: look.radius,
					bg: look.bg,
					corner: -3
				}
			});
		}
		for (const a of Array.from(doc.querySelectorAll("a.matchListItem"))) {
			const id = matchOfLink(a, base);
			if (!id || !view) continue;
			const box = a.getBoundingClientRect();
			if (!box.width || !box.height) {
				positioned(a, view);
				out.push({
					id,
					node: a,
					style: TILE_STYLE
				});
				continue;
			}
			const own = view.getComputedStyle(a);
			const mount = CLIPS.test(own.overflowX) || CLIPS.test(own.overflowY) ? a.parentElement ?? a : a;
			positioned(mount, view);
			let look = LOOK.get(a);
			if (!look) {
				const photo = a.firstElementChild;
				const radius = Math.max(radiusOf(a, view, box.width), photo ? radiusOf(photo, view, box.width) : 0);
				LOOK.set(a, look = {
					radius,
					bg: backgroundOf(mount, view),
					clip: clipperOf(mount, view)
				});
			}
			const c = look.clip?.getBoundingClientRect();
			const inset = !!c && (box.top - TILE_REACH < c.top || box.bottom + TILE_REACH > c.bottom);
			out.push({
				id,
				node: mount,
				style: boxStyle(box, mount.getBoundingClientRect(), mount),
				ring: {
					radius: look.radius,
					bg: look.bg,
					inset,
					corner: -7
				}
			});
		}
		return out;
	}
	function scrapePanel(doc) {
		try {
			const markers = [
				"Looking for",
				"Essentials",
				"Basics",
				"Interests",
				"Lifestyle",
				"My anthem",
				"wish list",
				"About"
			];
			let best = null;
			let bestScore = 0;
			let bestLen = 1e9;
			for (const el of Array.from(doc.querySelectorAll("div,section,aside,main,article"))) {
				const t = el.innerText ?? el.textContent ?? "";
				if (t.length < 20 || t.length > 8e3) continue;
				let score = 0;
				for (const m of markers) if (t.includes(m)) score++;
				if (score >= 2 && (score > bestScore || score === bestScore && t.length < bestLen)) {
					bestScore = score;
					bestLen = t.length;
					best = el;
				}
			}
			if (!best) return null;
			const lines = (best.innerText ?? best.textContent ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
			return lines.length ? { text: lines } : null;
		} catch {
			return null;
		}
	}
	function onUrlChange(win, cb, everyMs = 600) {
		let last = win.location.href;
		const check = () => {
			if (win.location.href !== last) {
				last = win.location.href;
				cb();
			}
		};
		const t = win.setInterval(check, everyMs);
		win.addEventListener("popstate", check);
		return () => {
			win.clearInterval(t);
			win.removeEventListener("popstate", check);
		};
	}
	var tinder_exports = __exportAll({
		SYNC_CHUNK: () => SYNC_CHUNK,
		start: () => start,
		timing: () => timing
	});
	var timing = {
		firstSyncMs: 2500,
		minGapMs: 5e3,
		retryMs: 3e4,
		busyRetryMs: 3e4,
		importRecheckMs: 2e4,
		graceMs: 6e3,
		uploadMs: 500,
		importDeadlineMs: 3e5
	};
	var SYNC_CHUNK = {
		matches: 250,
		bytes: 25e5
	};
	function start(host, win) {
		const doc = win.document;
		const capture = new TinderCapture();
		const panel = new Panel(doc);
		const marks = new Marks(doc, () => rowTargets(doc));
		const badges = new Map();
		const sent = new Map();
		const inFlight = new Set();
		const importing = new Map();
		let held = false;
		let openedAt = Date.now();
		let followed = null;
		let syncing = false;
		let syncTimer = null;
		let lastSync = 0;
		let busyRetry = false;
		installHooks(win, (path, query, json, body) => {
			const before = capture.version;
			capture.ingest(path, query, json, body);
			if (capture.version !== before) {
				scheduleSync();
				refresh();
			}
		});
		let syncDue = 0;
		function scheduleSync(delay) {
			const wait = delay ?? (lastSync ? Math.max(0, lastSync + timing.minGapMs - Date.now()) : timing.firstSyncMs);
			if (syncTimer !== null) {
				if (Date.now() + wait >= syncDue) return;
				win.clearTimeout(syncTimer);
			}
			syncDue = Date.now() + wait;
			syncTimer = win.setTimeout(() => {
				syncTimer = null;
				sync();
			}, wait);
		}
		function expireImports() {
			let gone = false;
			for (const [id, imp] of importing) if (Date.now() - imp.since > timing.importDeadlineMs) {
				importing.delete(id);
				gone = true;
			}
			return gone;
		}
		async function sync() {
			const api = createApi(host);
			if (syncing || !api.connected()) return;
			if (expireImports()) {
				drawChips();
				refresh();
			}
			const ids = toSend({
				ids: capture.matchIds(),
				version: (id) => capture.matchVersion(id),
				sent,
				badges,
				busyRetry
			});
			busyRetry = false;
			for (const id of importing.keys()) if (!ids.includes(id)) ids.push(id);
			const batch = ids.flatMap((id) => {
				const ev = capture.evidence(id);
				return ev ? [{
					id,
					version: capture.matchVersion(id),
					ev
				}] : [];
			});
			if (!batch.length) {
				if (importing.size) scheduleSync(timing.importRecheckMs);
				return;
			}
			syncing = true;
			lastSync = Date.now();
			for (const b of batch) inFlight.add(b.id);
			drawChips();
			let failed = false;
			try {
				const queue = chunks(batch);
				for (const chunk of queue) try {
					const r = await api.call("POST", "/api/girls/tinder-sync", {
						matches: chunk.map((b) => b.ev),
						lists_complete: capture.listsComplete()
					}, 6e4);
					for (const b of chunk) {
						sent.set(b.id, b.version);
						const badge = readBadge(r.badges?.[b.id]);
						if (!badge) continue;
						badges.set(b.id, badge);
						const imp = importing.get(b.id);
						if (imp && (badge.kind !== "not-imported" && badge.kind !== "busy" || Date.now() - imp.since > timing.importDeadlineMs)) importing.delete(b.id);
					}
				} catch (e) {
					if (e instanceof ApiError && e.status === 413 && chunk.length > 1) {
						const i = queue.indexOf(chunk);
						queue.splice(i + 1, 0, chunk.slice(0, chunk.length >> 1), chunk.slice(chunk.length >> 1));
						continue;
					}
					if (e instanceof ApiError && (e.status === 400 || e.status === 413)) {
						for (const b of chunk) sent.set(b.id, b.version);
						continue;
					}
					throw e;
				}
			} catch (e) {
				failed = !(e instanceof ApiError && e.status === 401);
			} finally {
				for (const b of batch) inFlight.delete(b.id);
				syncing = false;
				drawChips();
				refresh();
			}
			if (failed) return scheduleSync(timing.retryMs);
			if (capture.matchIds().some((id) => capture.matchVersion(id) !== sent.get(id) && capture.evidence(id))) return scheduleSync();
			if (importing.size || [...badges.values()].some((b) => b.kind === "busy")) {
				busyRetry = true;
				scheduleSync(importing.size ? timing.importRecheckMs : timing.busyRetryMs);
			}
		}
		function chunks(batch) {
			const out = [];
			let cur = [];
			let size = 0;
			for (const b of batch) {
				const n = new TextEncoder().encode(JSON.stringify(b.ev)).length;
				if (cur.length && (cur.length >= SYNC_CHUNK.matches || size + n > SYNC_CHUNK.bytes)) {
					out.push(cur);
					cur = [];
					size = 0;
				}
				cur.push(b);
				size += n;
			}
			if (cur.length) out.push(cur);
			return out;
		}
		function drawChips() {
			const connected = createApi(host).connected();
			const ids = new Set([...badges.keys(), ...importing.keys()]);
			for (const id of marks.ids()) if (!ids.has(id) || !connected) marks.set(id, null);
			if (!connected) return;
			const origin = createApi(host).origin;
			for (const id of ids) {
				const c = chipFor(badges.get(id) ?? null, {
					syncing: inFlight.has(id),
					importing: importing.has(id),
					tile: capture.listedAs(id) === "new"
				});
				if (!c) {
					marks.set(id, null);
					continue;
				}
				const slug = badges.get(id)?.slug;
				const onClick = c.action === "import" ? () => pressImport(id) : c.action === "open" && slug ? () => host.openTab(girlUrl(origin, slug)) : c.action === "review" && slug ? () => host.openTab(girlUrl(origin, slug, true)) : void 0;
				marks.set(id, {
					...c.spec,
					...onClick ? { onClick } : {}
				});
			}
		}
		function idle() {
			const open = matchFromPath(win.location.pathname);
			const origin = createApi(host).origin;
			const offer = pillFor({
				connected: createApi(host).connected(),
				onHerChat: !!open,
				group: !!open && capture.isGroup(open),
				name: open ? capture.nameOf(open) : null,
				badge: open ? badges.get(open) ?? null : null,
				importing: open ? importing.get(open) ?? null : null,
				fullProfile: !!open && capture.hasFullProfile(open),
				graceOver: Date.now() - openedAt > timing.graceMs
			});
			switch (offer.kind) {
				case "hidden": return { kind: "hidden" };
				case "connect": return {
					kind: "pill",
					label: "Connect RizzBot",
					onClick: showConnect
				};
				case "checking": return {
					kind: "pill",
					label: "Checking RizzBot",
					busy: true
				};
				case "reading": return {
					kind: "pill",
					label: "Reading her profile",
					busy: true
				};
				case "import": return {
					kind: "pill",
					label: `Import ${offer.name}`,
					onClick: () => open && pressImport(open)
				};
				case "importing": {
					const slug = offer.slug;
					return slug ? {
						kind: "pill",
						label: `Importing ${offer.name}`,
						title: "Press to open her in RizzBot",
						onClick: () => host.openTab(girlUrl(origin, slug))
					} : {
						kind: "pill",
						label: `Importing ${offer.name}`,
						busy: true
					};
				}
				case "in": return {
					kind: "pill",
					ok: true,
					label: `${offer.name} is in RizzBot`,
					title: "Press to open her in RizzBot",
					onClick: () => host.openTab(girlUrl(origin, offer.slug))
				};
			}
		}
		function refresh() {
			follow();
			if (held) return;
			panel.render(idle());
		}
		function follow() {
			const open = matchFromPath(win.location.pathname);
			const slug = open ? badges.get(open)?.slug : null;
			if (!open || !slug || followed === open) return;
			if (followChat(host, girlUrl(createApi(host).origin, slug)) !== "off") followed = open;
		}
		const release = () => {
			held = false;
			refresh();
		};
		let askingToConnect = false;
		function showConnect() {
			held = true;
			askingToConnect = true;
			panel.show({
				kind: "card",
				icon: "warn",
				title: "Connect RizzBot",
				text: ["One press links this browser to your RizzBot account. Then come back here."],
				buttons: [{
					label: "Connect",
					primary: true,
					icon: "link",
					onClick: () => openConnect(host, win.navigator.userAgent)
				}],
				onClose: () => {
					askingToConnect = false;
					release();
				}
			});
		}
		function pressImport(matchId) {
			if (importing.has(matchId)) return;
			if (importGate({
				matchId,
				openMatch: matchFromPath(win.location.pathname)
			}) === "open-her-first") {
				const name = capture.nameOf(matchId) ?? "her";
				held = true;
				panel.show({
					kind: "card",
					icon: "warn",
					title: `Open ${name} first`,
					text: [`Click ${name} on Tinder to open her chat, then press Import again.`],
					onClose: release
				});
				return;
			}
			if (!capture.hasFullProfile(matchId) && Date.now() - openedAt <= timing.graceMs) {
				const name = capture.nameOf(matchId) ?? "her";
				held = true;
				panel.show({
					kind: "card",
					icon: "warn",
					title: `Reading ${name}'s profile`,
					text: ["Tinder is still loading her profile. Press Import again in a moment."],
					onClose: release
				});
				return;
			}
			runImport(matchId);
		}
		async function runImport(matchId, onExisting) {
			if (importing.has(matchId)) return;
			const name = capture.nameOf(matchId) ?? "her";
			const payload = capture.importPayload(matchId, scrapePanel(doc));
			if (!payload) {
				held = true;
				panel.show({
					kind: "card",
					icon: "error",
					tone: "error",
					title: "Could not read her yet",
					text: ["Reload her chat on Tinder, wait for her profile to show, and press Import again."],
					onClose: release
				});
				return;
			}
			held = true;
			importing.set(matchId, {
				slug: null,
				since: Date.now()
			});
			drawChips();
			const api = createApi(host);
			const title = `Adding ${name}`;
			const started = Date.now();
			let bar = true;
			const tick = () => {
				if (!bar) return;
				const f = Math.min(1, (Date.now() - started) / timing.uploadMs);
				panel.show({
					kind: "card",
					title,
					text: [],
					icon: "spin",
					progress: {
						value: .05 + .9 * f,
						step: f < .5 ? "Reading her profile" : "Sending to RizzBot"
					}
				});
				if (f < 1) win.setTimeout(tick, 50);
			};
			tick();
			let end;
			try {
				end = importEnd(200, await api.call("POST", "/api/girls/from-tinder-web", onExisting ? {
					...payload,
					on_existing: onExisting
				} : payload, 9e4), "");
			} catch (e) {
				end = e instanceof ApiError ? importEnd(e.status, e.body, e.message) : importEnd(0, null, e instanceof Error ? e.message : "Something went wrong.");
			}
			const rest = timing.uploadMs - (Date.now() - started);
			if (rest > 0) await new Promise((r) => win.setTimeout(r, rest));
			bar = false;
			if (end.kind === "started") {
				importing.set(matchId, {
					slug: end.slug,
					since: Date.now()
				});
				const photos = Array.isArray(payload.user?.photos) ? payload.user.photos.length : 0;
				const messages = Array.isArray(payload.messages) ? payload.messages.length : 0;
				panel.show({
					kind: "card",
					tone: "ok",
					icon: "ok",
					title: "Upload complete",
					text: [`RizzBot is ${onExisting === "chat" ? "syncing" : "importing"} ${name} now.`],
					checklist: [
						...onExisting === "chat" ? [] : [{
							label: "Her profile",
							detail: photos ? plural(photos, "photo") : "profile",
							state: "done"
						}],
						{
							label: "Your chat",
							detail: messages ? plural(messages, "message") : "no messages yet",
							state: "done"
						},
						{
							label: onExisting === "chat" ? "Syncing in RizzBot" : "Importing in RizzBot",
							state: "running"
						}
					],
					link: {
						label: "Open in RizzBot",
						icon: "open",
						first: true,
						href: girlUrl(api.origin, end.slug)
					},
					onClose: release
				});
				busyRetry = true;
				scheduleSync(timing.importRecheckMs);
			} else {
				importing.delete(matchId);
				if (end.kind === "exists") panel.show({
					kind: "card",
					icon: "warn",
					title: "Already in your chats",
					text: [`${end.name} is in RizzBot already. Bring in her newest messages, or import her whole profile again.`],
					keep: true,
					buttons: [
						{
							label: "Sync chat only",
							blue: true,
							icon: "sync",
							onClick: () => void runImport(matchId, "chat")
						},
						{
							label: "Full re-import",
							icon: "retry",
							onClick: () => void runImport(matchId, "full")
						},
						{
							label: "Cancel",
							quiet: true,
							onClick: release
						}
					],
					onClose: release
				});
				else if (end.kind === "connect") showConnect();
				else if (end.kind === "plan") panel.show({
					kind: "card",
					icon: "warn",
					title: "Your plan is full",
					text: [end.message],
					link: {
						label: "See your plan",
						icon: "open",
						href: `${api.origin}/me#plan`
					},
					onClose: release
				});
				else {
					const retry = end.retry;
					panel.show({
						kind: "card",
						icon: "error",
						tone: "error",
						title: `Could not import ${name}`,
						text: [end.message],
						buttons: retry ? [{
							label: "Try again",
							primary: true,
							icon: "retry",
							onClick: () => void runImport(matchId, onExisting)
						}] : [],
						onClose: release
					});
				}
			}
			drawChips();
		}
		const onReady = () => {
			marks.watch();
			refresh();
			onUrlChange(win, () => {
				openedAt = Date.now();
				followed = null;
				if (!panel.isWorking()) held = false;
				refresh();
				win.setTimeout(refresh, timing.graceMs + 100);
			});
			win.setTimeout(refresh, timing.graceMs + 100);
			win.addEventListener("focus", () => {
				if (askingToConnect && createApi(host).connected()) {
					askingToConnect = false;
					release();
					sent.clear();
					scheduleSync(0);
				} else refresh();
				drawChips();
			});
		};
		if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", onReady, { once: true });
		else onReady();
	}
	var HostScopeError = class extends Error {
		constructor(message) {
			super(message);
			this.name = "HostScopeError";
		}
	};
	function scopeHost(host, prefix) {
		const check = (key) => {
			if (typeof key !== "string" || !key.startsWith(prefix)) throw new HostScopeError(`storage key "${String(key)}" must start with "${prefix}"`);
		};
		const scoped = {
			get: (key, fallback) => (check(key), host.get(key, fallback)),
			set: (key, value) => (check(key), host.set(key, value)),
			del: (key) => (check(key), host.del(key)),
			request: (req) => {
				let origin = "";
				try {
					origin = new URL(req.url).origin;
				} catch {}
				if (!isAllowedOrigin(origin)) return Promise.reject(new HostScopeError(`a site may only send to RizzBot, not ${req.url.slice(0, 80)}`));
				return host.request(req);
			},
			openTab: (url, opts) => host.openTab(url, opts),
			menu: (label, fn) => host.menu(label, fn),
			unmenu: (id) => host.unmenu(id),
			onChange: (key, fn) => (check(key), host.onChange(key, fn)),
			version: host.version
		};
		registerScoped(scoped, host);
		return scoped;
	}
	function matchPattern(pattern) {
		const m = /^(\*|https?):\/\/(\*|(?:\*\.)?[^/*]+)(\/.*)$/.exec(pattern);
		if (!m) throw new Error(`not a supported @match pattern: ${pattern}`);
		const [, scheme, host, path] = m;
		const esc = (s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
		const schemeRe = scheme === "*" ? "https?" : scheme;
		const hostRe = host === "*" ? "[^/]+" : host.startsWith("*.") ? `(?:[^/]+\\.)?${esc(host.slice(2))}` : esc(host);
		const pathRe = path.split("*").map(esc).join(".*");
		return new RegExp(`^${schemeRe}://${hostRe}${pathRe}$`);
	}
	var manifests = Object.assign({
		"./instagram/site.json": site_default$1,
		"./tinder/site.json": site_default
	});
	var modules = Object.assign({
		"./instagram/index.ts": instagram_exports,
		"./tinder/index.ts": tinder_exports
	});
	var PLACEHOLDER_DESCRIPTION = /what it does here, in one line/;
	function manifestProblems(dir, m) {
		const at = `src/sites/${dir}/site.json`;
		const out = [];
		const line = (v) => typeof v === "string" && v.trim().length > 0 && !/[\u0000-\u001f\u007f]/.test(v);
		if (m?.id !== dir) out.push(`${at} says id "${m?.id}"; it must be the folder name`);
		if (!line(m?.name)) out.push(`${at}: name must be one line of text`);
		if (!line(m?.description)) out.push(`${at}: description must be one line of text`);
		else if (PLACEHOLDER_DESCRIPTION.test(m.description)) out.push(`${at}: description is still the scaffold's placeholder`);
		if (!Array.isArray(m?.matches) || !m.matches.length) out.push(`${at}: matches must list at least one @match pattern`);
		else for (const p of m.matches) try {
			matchPattern(p);
		} catch (e) {
			out.push(`${at}: ${e.message}`);
		}
		if (typeof m?.storage !== "string" || !/^[a-z][a-z0-9]*\.$/.test(m.storage)) out.push(`${at}: storage must be a key prefix like "ig." or "tinder."`);
		if (!Array.isArray(m?.network) || !m.network.every((f) => typeof f === "string" && /^[\w.-]+$/.test(f))) out.push(`${at}: network must list file names in the folder ([] for none)`);
		if (m?.requests !== void 0 && m.requests !== "none") out.push(`${at}: requests is "none" (a passive site) or left out`);
		if (m?.testUrls !== void 0) {
			const res = Array.isArray(m.matches) ? m.matches.flatMap((p) => {
				try {
					return [matchPattern(p)];
				} catch {
					return [];
				}
			}) : [];
			if (!Array.isArray(m.testUrls) || !m.testUrls.every((u) => typeof u === "string" && res.some((r) => r.test(u)))) out.push(`${at}: every testUrls entry must be a page its matches cover`);
		}
		return out;
	}
	function buildSites(m, mods) {
		const sites = [];
		const problems = [];
		for (const [path, manifest] of Object.entries(m)) {
			const dir = path.split("/")[1];
			const bad = manifestProblems(dir, manifest);
			const mod = mods[`./${dir}/index.ts`];
			if (typeof mod?.start !== "function") bad.push(`src/sites/${dir}/index.ts must export start(host, win)`);
			if (bad.length) {
				problems.push(...bad);
				continue;
			}
			const res = manifest.matches.map(matchPattern);
			sites.push({
				...manifest,
				start: mod.start,
				test: (href) => res.some((r) => r.test(href))
			});
		}
		sites.sort((a, b) => a.id.localeCompare(b.id));
		return {
			sites,
			problems
		};
	}
	var built = buildSites(manifests, modules);
	var SITES = built.sites;
	var SITE_PROBLEMS = built.problems;
	function siteFor(href) {
		return pickSite(SITES, href);
	}
	function pickSite(sites, href) {
		const page = href.split("#")[0];
		return sites.find((s) => s.test(page)) ?? null;
	}
	function startSite(site, host, win, report = console.error) {
		try {
			site.start(scopeHost(host, site.storage), win);
			return true;
		} catch (e) {
			report(`RizzBot Connect: ${site.name} did not start`, e);
			return false;
		}
	}
	var win = typeof _unsafeWindow !== "undefined" ? _unsafeWindow : window;
	var host = gmHost;
	host.menu("Connect to RizzBot", () => openConnect(host, win.navigator.userAgent));
	host.menu("Disconnect from RizzBot", () => {
		const origin = currentOrigin(host);
		if (!connectionFor(host, origin)) return win.alert("RizzBot Connect is not connected.");
		createApi(host).call("POST", "/api/recorder/disconnect").then(() => true, (e) => e instanceof ApiError && e.status === 401 || e instanceof NotConnectedError).then((revoked) => {
			clearConnection(host, origin);
			win.alert(revoked ? "Disconnected from RizzBot." : "This browser forgot its RizzBot connection, but RizzBot could not be reached to end it. Remove it on your RizzBot profile page (Me).");
		});
	});
	host.menu("Which RizzBot site", () => {
		const now = currentOrigin(host);
		const next = win.prompt(`RizzBot Connect sends to:\n${now}\n\nType ${PRODUCTION_ORIGIN} or a dev server like http://localhost:3000`, now);
		if (next === null) return;
		if (!setOrigin(host, next)) win.alert("That is not a RizzBot address this script may send to.");
	});
	if (SITE_PROBLEMS.length) console.error("RizzBot Connect: sites left out:\n" + SITE_PROBLEMS.join("\n"));
	var site = siteFor(win.location.href);
	if (site) startSite(site, host, win);
	else if (isConnectPage(win.location)) runConnectPage(host, win);
	var follower = !site && !isConnectPage(win.location) && isAllowedOrigin(win.location.origin) ? runFollower(host, win) : null;
	installFollowMenu(host, (t) => win.alert(t), (on) => on ? follower?.start() : follower?.stop());
})();
