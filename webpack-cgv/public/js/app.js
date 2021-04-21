var urlStr = "https://localhost:8080/test.jsp?q=URLUtils.searchParams&topic=api";
urlStr = "https://localhost:8080/test.jsp";
var a = Object.fromEntries((new URL(urlStr)).searchParams);
console.log(a);
