//import { load, types } from "../../lib/koffi/index.js";
import { load, types } from "../../lib/ffi-napi/index.js";

const call = load("user32.dll", { abi: "stdcall" });

const MessageBoxA = call("MessageBoxA", "int", ["void *", types.win32.LPCSTR , types.win32.LPCSTR, "uint"]);

const MB_ICONINFORMATION = 0x40;
MessageBoxA(null, "Hello World!", "Message", MB_ICONINFORMATION);