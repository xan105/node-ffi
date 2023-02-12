import { load, types } from "../lib/koffi.js";
//import { load, types } from "../lib/ffi-napi.js";

const call = load("user32.dll", { abi: "stdcall" });

const MessageBoxA = call("MessageBoxA", "int", ["void *", types.LPCSTR , types.LPCSTR, "uint"]);

const MB_ICONINFORMATION = 0x40;
MessageBoxA(null, "Hello World!", "Message", MB_ICONINFORMATION);