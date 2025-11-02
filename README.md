<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>CA NHAN 1</title>
    <style>
        body { font-family: Arial; background: #f4f4f4; text-align: center; margin-top: 80px; }
        #box { background: white; padding: 20px; border-radius: 12px; width: 500px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        input, button { padding: 10px; margin-top: 10px; width: 80%; }
        button { width: 40%; cursor: pointer; background: #0078d4; color: white; border: none; border-radius: 6px; }
        #review { margin-top: 20px; font-size: 1.1em; }
    </style>
</head>
<body>
    <div id="box">
        <h2>🔍 CA NHAN 1</h2>
        <input type="text" id="product" placeholder="Nhập tên hoặc mô tả sản phẩm..."><br>
        <button onclick="getReview()">Tạo Review</button>
        <div id="review"></div>
    </div>
</body>
</html>
