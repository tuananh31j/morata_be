export type Content = {
    subject: string;
    content: {
        title?: string;
        description: string;
        warning?: string;
        email: string;
    };
    product?: {
        items: {
            productId?: string;
            image: string;
            name: string;
            quantity: number;
            price: number;
        }[];
        totalPrice: number;
        shippingfee: number;
    };
    link: {
        linkName: string;
        linkHerf: string;
    };
    user?: {
        name: string;
        phone: string;
        email: string;
        address: string;
    };
};
type Template = 'Verify' | 'ResetPassword' | 'UpdateStatusOrder';
export const templateMail = (template: Template, mailContent: Content) => {
    switch (template) {
        case 'Verify' || 'ResetPassword':
            return `
            <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Activate Your Morata Account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .background {
        background-color: #f7f9fc;
        border-radius: 10px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="background">
        <div class="header">
          <img
            src="https://demo-morata.myshopify.com/cdn/shop/files/logo_150x@2x.png?v=1697202938"
            alt="Morata Logo"
          />
          <h1>Chào mừng bạn đến với Morata!</h1>
        </div>
        <div class="content">
          <h1>${mailContent?.content?.title}</h1>
          <p style="color: white text-decoration: none;">Hello ${mailContent?.content?.email},</p>
          <p>${mailContent?.content?.description}</p>
          <a style="color: white" href="${mailContent?.link?.linkHerf}" class="btn"
            >${mailContent?.link?.linkName}</a
          >
          <p>${mailContent?.content?.warning && mailContent?.content?.warning}</p>
        </div>
        <div class="footer">
          <p>Thank you,<br />The Morata Team</p>
          <p><small>Morata Inc., FPT Polytechnic, Ha Noi, Viet Nam</small></p>
        </div>
      </div>
    </div>
  </body>
</html>`;
        case 'UpdateStatusOrder':
            return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation from Morata</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f9fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #edefef;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px;
        background-color: #1e3a8a;
        color: #ffffff;
        border-radius: 10px 10px 0 0;
        margin-bottom: 20px;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 20px;
        color: #333;
      }
      .content h1 {
        color: #1e3a8a;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content p {
        line-height: 1.6;
        margin-bottom: 20px;
        color: #333; /* Ensure text color is correct */
      }
      a {
        color: #ffffff; /* Ensure link color */
        text-decoration: none;
      }
      .btn {
        display: inline-block;
        background-color: #1e3a8a;
        color: #ffffff;
        padding: 12px 25px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #123b7b;
      }
      .product-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .product-table th,
      .product-table td {
        padding: 10px;
        border: 1px solid #ddd;
      }
      .product-table th {
        background-color: #f4f4f4;
        text-align: left;
      }
      .product-table img {
        max-width: 70px;
        height: auto;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://demo-morata.myshopify.com/cdn/shop/files/logo_150x@2x.png?v=1697202938"
          alt="Morata Logo"
        />
        <h1>${mailContent?.content?.title}</h1>
      </div>
      <div class="content">
        <h1>Xin chào, ${mailContent?.user?.name}!</h1>
        <p>${mailContent.content.description}</p>
        
        ${
            mailContent.user &&
            `
        <p><strong>Tên người nhận:</strong> ${mailContent?.user?.name}</p>
        <p><strong>Số điện thoại:</strong> ${mailContent?.user?.phone}</p>
        <p><strong>Email:</strong> ${mailContent?.user?.email}</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${mailContent?.user?.address}</p>
        `
        }

        <table class="product-table">
          <thead>
            <tr>
              <th>Ảnh Sản Phẩm</th>
              <th>Tên Sản Phẩm</th>
              <th>Số Lượng</th>
              <th>Giá Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${mailContent.product?.items
                .map(
                    (product) => `
            <tr>
              <td><img src="${product.image}" alt="${product.name}" /></td>
              <td>${product.name}</td>
              <td>${product.quantity}</td>
              <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
            </tr>
            `,
                )
                .join('')}
          </tbody>
        </table>
        ${mailContent.product?.shippingfee ? `<p><strong>Phí Giao Hàng:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product.shippingfee)}</p>` : `<p><strong>Phí Giao Hàng:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</p>`}
        ${mailContent.product?.totalPrice ? `<p><strong>Tổng Tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mailContent.product.totalPrice)}</p>` : `<p><strong>Tổng Tiền:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</p>`}
       
        <p>Để kiểm tra đơn hàng của bạn: <a href='${mailContent?.link?.linkHerf}'>Tại đây</a> </p>
    
      </div>
      <div class="footer">
        <p>Thank you,<br />The Morata Team</p>
        <p><small>Morata Inc., FPT Polytechnic, Ha Noi, Viet Nam</small></p>
      </div>
    </div>
  </body>
</html>


`;
        default:
            return 'none';
    }
};
