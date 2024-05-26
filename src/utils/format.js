export const formatNumber = (number) => {
  if (number < 10000) {
    return number.toLocaleString(); // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với dấu phân cách
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + "K"; // Chia cho 1000 và thêm 'K' sau số đã làm tròn
  } else {
    return (number / 1000000).toFixed(1) + "M"; // Chia cho 1000000 và thêm 'M' sau số đã làm tròn
  }
};
