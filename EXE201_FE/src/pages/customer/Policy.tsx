import React from "react";
import { PageTransition } from "../../components/PageTransition";

const Policy: React.FC = () => {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-7xl">
        {/* Tiêu đề chính */}

        <div className="space-y-10">
          {/* Chính sách đổi trả */}
          <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
              Chính Sách Đổi Trả
            </h2>
            <div className="text-gray-700 space-y-5 text-base leading-relaxed">
              <p>
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho
                khách hàng. Nếu sản phẩm bạn nhận được có lỗi hoặc không đúng
                như mô tả, bạn có thể yêu cầu đổi trả trong các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Sản phẩm bị lỗi kỹ thuật hoặc hư hỏng do quá trình sản xuất
                  hoặc vận chuyển.
                </li>
                <li>
                  Sản phẩm không đúng với mô tả hoặc hình ảnh trên website.
                </li>
                <li>
                  Sản phẩm còn trong thời hạn đổi trả:{" "}
                  <span className="font-semibold">7 ngày</span> kể từ ngày nhận
                  hàng đối với sản phẩm thông thường,{" "}
                  <span className="font-semibold">3 ngày</span> đối với sản phẩm
                  điện tử.
                </li>
              </ul>
              <p className="font-semibold text-lg">Điều kiện đổi trả:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Sản phẩm chưa qua sử dụng, còn nguyên tem, nhãn mác.</li>
                <li>
                  Khách hàng cung cấp hóa đơn mua hàng hoặc mã đơn hàng để xác
                  nhận.
                </li>
                <li>
                  Sản phẩm không thuộc danh mục không được đổi trả (ví dụ: sản
                  phẩm đã qua sử dụng hoặc sản phẩm đặt riêng theo yêu cầu).
                </li>
              </ul>
              <p>
                Để yêu cầu đổi trả, vui lòng liên hệ qua email{" "}
                <a
                  href="mailto:support@nhieuthuay.com"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  support@nhieuthuay.com
                </a>{" "}
                hoặc hotline <span className="font-semibold">1900 1234</span>{" "}
                trong giờ hành chính. Chúng tôi sẽ xử lý yêu cầu trong vòng{" "}
                <span className="font-semibold">48 giờ</span>.
              </p>
            </div>
          </section>

          {/* Chính sách vận chuyển */}
          <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
              Chính Sách Vận Chuyển
            </h2>
            <div className="text-gray-700 space-y-5 text-base leading-relaxed">
              <p>
                Chúng tôi cung cấp dịch vụ vận chuyển nhanh chóng và an toàn
                trên toàn quốc, đảm bảo sản phẩm đến tay khách hàng trong thời
                gian sớm nhất.
              </p>
              <p className="font-semibold text-lg">Phạm vi giao hàng:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Giao hàng toàn quốc, bao gồm các khu vực nội thành và ngoại
                  tỉnh.
                </li>
                <li>
                  Thời gian giao hàng:{" "}
                  <span className="font-semibold">1-3 ngày</span> đối với nội
                  thành, <span className="font-semibold">3-7 ngày</span> đối với
                  ngoại tỉnh (không tính thứ Bảy, Chủ Nhật và ngày lễ).
                </li>
              </ul>
              <p className="font-semibold text-lg">Phí vận chuyển:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Miễn phí giao hàng cho đơn hàng từ{" "}
                  <span className="font-semibold">1.000.000 VND</span> trở lên
                  (áp dụng cho giao hàng tiêu chuẩn).
                </li>
                <li>
                  Phí giao hàng tiêu chuẩn:{" "}
                  <span className="font-semibold">30.000 VND</span> cho nội
                  thành, <span className="font-semibold">50.000 VND</span> cho
                  ngoại tỉnh.
                </li>
                <li>
                  Giao hàng nhanh (trong ngày):{" "}
                  <span className="font-semibold">50.000 VND</span> (chỉ áp dụng
                  tại Hà Nội và TP.HCM).
                </li>
              </ul>
              <p>
                Khách hàng có thể kiểm tra trạng thái đơn hàng qua website hoặc
                liên hệ hotline <span className="font-semibold">1900 1234</span>
                . Trong trường hợp có sự cố về vận chuyển, chúng tôi cam kết hỗ
                trợ và giải quyết trong thời gian sớm nhất.
              </p>
            </div>
          </section>

          {/* Chính sách bảo hành */}
          <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
              Chính Sách Bảo Hành
            </h2>
            <div className="text-gray-700 space-y-5 text-base leading-relaxed">
              <p>
                Tất cả sản phẩm được bán tại Nhieuthuay đều đi kèm chính sách
                bảo hành chính hãng, đảm bảo quyền lợi tối đa cho khách hàng.
              </p>
              <p className="font-semibold text-lg">Điều kiện bảo hành:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Sản phẩm còn trong thời gian bảo hành (thường từ{" "}
                  <span className="font-semibold">6-12 tháng</span>, tùy sản
                  phẩm).
                </li>
                <li>
                  Lỗi kỹ thuật thuộc về nhà sản xuất, không phải do người dùng
                  gây ra (ví dụ: rơi vỡ, sử dụng sai cách).
                </li>
                <li>
                  Sản phẩm còn nguyên tem bảo hành và có hóa đơn mua hàng.
                </li>
              </ul>
              <p className="font-semibold text-lg">Quy trình bảo hành:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Khách hàng gửi sản phẩm cần bảo hành đến trung tâm bảo hành
                  của Nhieuthuay hoặc đối tác được ủy quyền.
                </li>
                <li>
                  Thời gian xử lý bảo hành:{" "}
                  <span className="font-semibold">7-14 ngày làm việc</span> kể
                  từ khi nhận được sản phẩm.
                </li>
                <li>
                  Trong trường hợp không thể sửa chữa, chúng tôi sẽ đổi sản phẩm
                  mới tương đương hoặc hoàn tiền theo giá trị còn lại của sản
                  phẩm.
                </li>
              </ul>
              <p>
                Để biết thêm chi tiết, vui lòng liên hệ trung tâm hỗ trợ qua
                email{" "}
                <a
                  href="mailto:support@nhieuthuay.com"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  support@nhieuthuay.com
                </a>{" "}
                hoặc hotline <span className="font-semibold">1900 1234</span>.
              </p>
            </div>
          </section>

          {/* Chính sách bảo mật thông tin */}
          <section className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6 text-center">
              Chính Sách Bảo Mật Thông Tin
            </h2>
            <div className="text-gray-700 space-y-5 text-base leading-relaxed">
              <p>
                Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng theo
                quy định của pháp luật và tiêu chuẩn bảo mật cao nhất.
              </p>
              <p className="font-semibold text-lg">Thu thập thông tin:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Chúng tôi chỉ thu thập các thông tin cần thiết để xử lý đơn
                  hàng (tên, số điện thoại, địa chỉ, email).
                </li>
                <li>
                  Thông tin thanh toán được xử lý qua cổng thanh toán bảo mật,
                  không lưu trữ trên hệ thống của chúng tôi.
                </li>
              </ul>
              <p className="font-semibold text-lg">Sử dụng thông tin:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Thông tin được sử dụng để liên hệ, giao hàng, và cung cấp
                  thông tin về khuyến mãi (nếu khách hàng đồng ý).
                </li>
                <li>
                  Không chia sẻ thông tin cá nhân với bên thứ ba, trừ trường hợp
                  được yêu cầu bởi cơ quan pháp luật.
                </li>
              </ul>
              <p>
                Khách hàng có quyền yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân
                bằng cách liên hệ qua email{" "}
                <a
                  href="mailto:support@nhieuthuay.com"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                >
                  support@nhieuthuay.com
                </a>
                .
              </p>
            </div>
          </section>
        </div>

        {/* Nút liên hệ hỗ trợ */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách của chúng tôi, đừng ngần
            ngại liên hệ!
          </p>{" "}
          <a
            href="mailto:support@nhieuthuay.com"
            className="inline-block bg-blue-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors duration-300"
          >
            Liên Hệ Hỗ Trợ
          </a>
        </div>
      </div>
    </PageTransition>
  );
};

export default Policy;
