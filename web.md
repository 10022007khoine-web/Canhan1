<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>CA NHAN 1 - Review</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #chatbox {
            background: white;
            width: 500px;
            height: 600px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        #messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .message {
            margin: 10px 0;
            display: flex;
        }

        .user {
            justify-content: flex-end;
        }

        .ai {
            justify-content: flex-start;
        }

        .bubble {
            padding: 12px 16px;
            border-radius: 15px;
            max-width: 75%;
            line-height: 1.4;
            word-wrap: break-word;
            animation: fadeIn 0.3s ease-in;
        }

        .user .bubble {
            background: #0078d4;
            color: white;
            border-bottom-right-radius: 2px;
        }

        .ai .bubble {
            background: #e9ecef;
            color: #333;
            border-bottom-left-radius: 2px;
        }

        #input-area {
            display: flex;
            border-top: 1px solid #ccc;
            padding: 10px;
            background: #fafafa;
        }

        #product {
            flex: 1;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            outline: none;
        }

        button {
            margin-left: 10px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 16px;
            cursor: pointer;
        }

        button:hover {
            background: #005fa3;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div id="chatbox">
        <div id="messages">
            <div class="message ai">
                <div class="bubble">Xin chào 👋! Hãy nhập tên sản phẩm bạn muốn tôi review.</div>
            </div>
        </div>

        <div id="input-area">
            <input type="text" id="product" placeholder="Nhập tên hoặc mô tả sản phẩm...">
            <button onclick="getReview()">Gửi</button>
        </div>
    </div>

    <script>
        const messages = document.getElementById("messages");

        function addMessage(content, sender = "ai") {
            const msg = document.createElement("div");
            msg.className = `message ${sender}`;
            msg.innerHTML = `<div class="bubble">${content}</div>`;
            messages.appendChild(msg);
            messages.scrollTop = messages.scrollHeight; // tự động cuộn xuống
        }

        async function getReview() {
            const input = document.getElementById("product");
            const product = input.value.trim();
            if (!product) return alert("Vui lòng nhập tên sản phẩm!");
            addMessage(product, "user");
            input.value = "";

            // Thêm hiệu ứng AI đang gõ
            const loadingMsg = document.createElement("div");
            loadingMsg.className = "message ai";
            loadingMsg.innerHTML = `<div class="bubble">💬 Đang tạo review bằng AI...</div>`;
            messages.appendChild(loadingMsg);
            messages.scrollTop = messages.scrollHeight;

            try {
                const res = await fetch("/review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ product })
                });

                const data = await res.json();
                loadingMsg.remove();
                addMessage(`<b>AI Review:</b><br>${data.review}`, "ai");
            } catch (err) {
                loadingMsg.remove();
                addMessage("❌ Lỗi khi kết nối tới AI. Vui lòng thử lại.", "ai");
            }
        }

        // Cho phép nhấn Enter để gửi
        document.getElementById("product").addEventListener("keypress", (e) => {
            if (e.key === "Enter") getReview();
        });
    </script>
</body>
</html>
