export * from "./open.js";
export * from "./helper.js";
export const types: {
    i8: ref.Type<number>;
    u8: ref.Type<number>;
    i16: ref.Type<number>;
    u16: ref.Type<number>;
    i32: ref.Type<number>;
    u32: ref.Type<number>;
    i64: ref.Type<string | number>;
    u64: ref.Type<string | number>;
    usize: ref.Type<string | number>;
    f32: ref.Type<number>;
    f64: ref.Type<number>;
    VOID: ref.Type<void>;
    ENUM: ref.Type<number>;
    DWORD: ref.Type<string | number>;
    WORD: ref.Type<number>;
    SHORT: ref.Type<number>;
    BYTE: ref.Type<number>;
    WCHAR: ref.Type<number>;
    ACCESS_MASK: ref.Type<number>;
    ATOM: ref.Type<number>;
    PVOID: ref.Type<ref.Pointer<string | number>>;
    HANDLE: ref.Type<string | number>;
    HANDLE_PVOID: ref.Type<ref.Pointer<string | number>>;
    LONG_PTR: ref.Type<ref.Pointer<string | number>>;
    ULONG_PTR: ref.Type<ref.Pointer<string | number>>;
    BOOL: ref.Type<number>;
    BOOLEAN: ref.Type<boolean>;
    CALLBACK: any;
    CCHAR: ref.Type<number>;
    CHAR: ref.Type<number>;
    COLORREF: ref.Type<string | number>;
    DWORDLONG: ref.Type<string | number>;
    DWORD_PTR: ref.Type<ref.Pointer<string | number>>;
    DWORD32: ref.Type<number>;
    DWORD64: ref.Type<string | number>;
    FLOAT: ref.Type<number>;
    HACCEL: ref.Type<string | number>;
    HALF_PTR: ref.Type<number>;
    HBITMAP: ref.Type<string | number>;
    HBRUSH: ref.Type<string | number>;
    HCOLORSPACE: ref.Type<string | number>;
    HCONV: ref.Type<string | number>;
    HCONVLIST: ref.Type<string | number>;
    HCURSOR: ref.Type<string | number>;
    HDC: ref.Type<string | number>;
    HDDEDATA: ref.Type<string | number>;
    HDESK: ref.Type<string | number>;
    HDROP: ref.Type<string | number>;
    HDWP: ref.Type<string | number>;
    HENHMETAFILE: ref.Type<string | number>;
    HFILE: ref.Type<string | number>;
    HFONT: ref.Type<string | number>;
    HGDIOBJ: ref.Type<string | number>;
    HGLOBAL: ref.Type<string | number>;
    HHOOK: ref.Type<string | number>;
    HICON: ref.Type<string | number>;
    HINSTANCE: ref.Type<string | number>;
    HKEY: ref.Type<string | number>;
    HKL: ref.Type<string | number>;
    HLOCAL: ref.Type<string | number>;
    HMENU: ref.Type<string | number>;
    HMETAFILE: ref.Type<string | number>;
    HMODULE: ref.Type<string | number>;
    HMONITOR: ref.Type<string | number>;
    HPALETTE: ref.Type<string | number>;
    HPEN: ref.Type<string | number>;
    HRESULT: ref.Type<string | number>;
    HRGN: ref.Type<string | number>;
    HRSRC: ref.Type<string | number>;
    HSZ: ref.Type<string | number>;
    HWINEVENTHOOK: ref.Type<string | number>;
    HWINSTA: ref.Type<string | number>;
    HWND: ref.Type<string | number>;
    INT: ref.Type<number>;
    INT_PTR: ref.Type<string | number>;
    INT8: ref.Type<number>;
    INT16: ref.Type<number>;
    INT32: ref.Type<number>;
    INT64: ref.Type<string | number>;
    LANGID: ref.Type<number>;
    LCID: ref.Type<string | number>;
    LCTYPE: ref.Type<string | number>;
    LGRPID: ref.Type<string | number>;
    LONG: ref.Type<string | number>;
    LONGLONG: ref.Type<string | number>;
    LONG32: ref.Type<number>;
    LONG64: ref.Type<string | number>;
    LPARAM: ref.Type<ref.Pointer<string | number>>;
    LPBOOL: ref.Type<number>;
    LPBYTE: ref.Type<ref.Pointer<number>>;
    LPCOLORREF: ref.Type<string | number>;
    LPCSTR: ref.Type<string | null>;
    LPCTSTR: ref.Type<string | null>;
    LPCWSTR: ref.Type<string | null>;
    LPVOID: ref.Type<ref.Pointer<void>>;
    LPCVOID: ref.Type<ref.Pointer<void>>;
    LPDWORD: ref.Type<ref.Pointer<number>>;
    LPHANDLE: ref.Type<ref.Pointer<string | number>>;
    LPINT: ref.Type<ref.Pointer<number>>;
    LPLONG: ref.Type<ref.Pointer<number>>;
    LPMSG: any;
    LPPOINT: any;
    LPSTR: ref.Type<ref.Pointer<number>>;
    LPWSTR: ref.Type<ref.Pointer<number>>;
    LPTSTR: ref.Type<ref.Pointer<number>>;
    LPWORD: ref.Type<ref.Pointer<number>>;
    LRESULT: ref.Type<ref.Pointer<string | number>>;
    NTSTATUS: ref.Type<number>;
    PBOOL: ref.Type<ref.Pointer<number>>;
    PBOOLEAN: ref.Type<ref.Pointer<boolean>>;
    PBYTE: ref.Type<ref.Pointer<number>>;
    PCHAR: ref.Type<ref.Pointer<number>>;
    PCSTR: ref.Type<ref.Pointer<number>>;
    PCTSTR: ref.Type<ref.Pointer<number>>;
    PCWSTR: ref.Type<ref.Pointer<number>>;
    PDWORD: ref.Type<ref.Pointer<number>>;
    PDWORDLONG: ref.Type<ref.Pointer<string | number>>;
    PDWORD_PTR: ref.Type<ref.Pointer<string | number>>;
    PDWORD32: ref.Type<ref.Pointer<number>>;
    PDWORD64: ref.Type<ref.Pointer<string | number>>;
    PFLOAT: ref.Type<ref.Pointer<number>>;
    PHALF_PTR: any;
    PHANDLE: ref.Type<ref.Pointer<ref.Pointer<string | number>>>;
    PHKEY: ref.Type<ref.Pointer<ref.Pointer<string | number>>>;
    PINT: ref.Type<ref.Pointer<number>>;
    PINT_PTR: ref.Type<ref.Pointer<ref.Pointer<number>>>;
    PINT8: ref.Type<ref.Pointer<number>>;
    PINT16: ref.Type<ref.Pointer<number>>;
    PINT32: ref.Type<ref.Pointer<number>>;
    PINT64: ref.Type<ref.Pointer<string | number>>;
    PLCID: ref.Type<ref.Pointer<number>>;
    PLONG: ref.Type<ref.Pointer<string | number>>;
    PLONGLONG: ref.Type<ref.Pointer<string | number>>;
    PLONG_PTR: any;
    PLONG32: ref.Type<ref.Pointer<number>>;
    PLONG64: ref.Type<ref.Pointer<string | number>>;
    POINTER_32: ref.Type<ref.Pointer<number>>;
    POINTER_64: ref.Type<ref.Pointer<string | number>>;
    POINTER_SIGNED: any;
    POINTER_UNSIGNED: any;
    PSHORT: ref.Type<ref.Pointer<number>>;
    PSIZE_T: ref.Type<ref.Pointer<string | number>>;
    PSSIZE_T: any;
    PSTR: ref.Type<ref.Pointer<number>>;
    PTBYTE: ref.Type<ref.Pointer<number>>;
    PTCHAR: ref.Type<ref.Pointer<number>>;
    PTSTR: ref.Type<ref.Pointer<number>>;
    PUCHAR: any;
    PUHALF_PTR: any;
    PUINT: ref.Type<ref.Pointer<number>>;
    PUINT_PTR: ref.Type<ref.Pointer<ref.Pointer<number>>>;
    PUINT8: ref.Type<ref.Pointer<number>>;
    PUINT16: ref.Type<ref.Pointer<number>>;
    PUINT32: ref.Type<ref.Pointer<number>>;
    PUINT64: ref.Type<ref.Pointer<string | number>>;
    PULONG: ref.Type<ref.Pointer<number>>;
    PULONGLONG: ref.Type<ref.Pointer<string | number>>;
    PULONG_PTR: ref.Type<ref.Pointer<ref.Pointer<string | number>>>;
    PULONG32: ref.Type<ref.Pointer<number>>;
    PULONG64: ref.Type<ref.Pointer<string | number>>;
    PUSHORT: ref.Type<ref.Pointer<number>>;
    PWCHAR: ref.Type<ref.Pointer<number>>;
    PWORD: ref.Type<ref.Pointer<number>>;
    PWSTR: ref.Type<ref.Pointer<number>>;
    QWORD: ref.Type<ref.Pointer<string | number>>;
    SC_HANDLE: ref.Type<string | number>;
    SC_LOCK: ref.Type<ref.Pointer<void>>;
    SERVICE_STATUS_HANDLE: ref.Type<string | number>;
    SIZE_T: ref.Type<ref.Pointer<string | number>>;
    SSIZE_T: ref.Type<ref.Pointer<string | number>>;
    TBYTE: ref.Type<number>;
    TCHAR: ref.Type<number>;
    UCHAR: ref.Type<number>;
    UHALF_PTR: ref.Type<number>;
    UINT: ref.Type<number>;
    UINT_PTR: ref.Type<string | number>;
    UINT8: ref.Type<number>;
    UINT16: ref.Type<number>;
    UINT32: ref.Type<number>;
    UINT64: ref.Type<string | number>;
    ULONG: ref.Type<string | number>;
    ULONGLONG: ref.Type<string | number>;
    ULONG32: ref.Type<number>;
    ULONG64: ref.Type<string | number>;
    USHORT: ref.Type<number>;
    USN: ref.Type<string | number>;
    WPARAM: ref.Type<string | number>;
    long: ref.Type<string | number>;
    short: ref.Type<number>;
    float: ref.Type<number>;
    void: ref.Type<void>;
    int64: ref.Type<string | number>;
    ushort: ref.Type<number>;
    int: ref.Type<number>;
    uint64: ref.Type<string | number>;
    uint: ref.Type<number>;
    double: ref.Type<number>;
    int8: ref.Type<number>;
    ulong: ref.Type<string | number>;
    Object: ref.Type<unknown>;
    uint8: ref.Type<number>;
    longlong: ref.Type<string | number>;
    CString: ref.Type<string | null>;
    int16: ref.Type<number>;
    ulonglong: ref.Type<string | number>;
    bool: ref.Type<boolean>;
    uint16: ref.Type<number>;
    char: ref.Type<number>;
    byte: ref.Type<number>;
    int32: ref.Type<number>;
    uchar: ref.Type<number>;
    size_t: ref.Type<string | number>;
    uint32: ref.Type<number>;
};
import ref from "ref-napi";
