load("config.js");

// Trang chu STV: 6 tab giong ext QuocBao (v11) - minc=50 (chi truyen
// tu 50 chuong tro len). Tab "Truyen Vip Free" cu da bi xoa: tag=vip,
// API tra {"list":[]} rong, khong co truyen nao, mo len chi thay loi.
// Kiem chung live 25/11/2026: ca 6 tab deu tra code 100, co sach.
function execute() {
  return Response.success([
    { title: "Mới cập nhật", input: "?find=&minc=50&sort=update&tag=", script: "homecontent.js" },
    { title: "Đọc tuần", input: "?find=&minc=50&sort=viewweek&tag=", script: "homecontent.js" },
    { title: "Đọc ngày", input: "?find=&minc=50&sort=viewday&tag=", script: "homecontent.js" },
    { title: "Đọc tổng", input: "?find=&minc=50&sort=view&tag=", script: "homecontent.js" },
    { title: "Mới nhập kho", input: "?find=&minc=50&sort=new&tag=", script: "homecontent.js" },
    { title: "Đề cử ngẫu nhiên", input: "?find=&minc=50&sort=auto&step=5&tag=", script: "homecontent.js" }
  ]);
}
