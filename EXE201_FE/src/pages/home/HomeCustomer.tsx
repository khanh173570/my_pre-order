import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const HomeCustomer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 48,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl mx-4 mt-4 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="bg-blue-800 text-white px-3 py-1 rounded text-sm mb-4 inline-block">
              MÔ GÒM DEAL
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Mô hình
              <br />
              Gundam
            </h1>
            <p className="text-blue-100 mb-6 text-lg">
              Gunpla có thiết kế lắp ráp không cần keo và không ảnh hưởng đến
              kết cấu mô hình. Các mẫu cao cấp có khung xương bên trong, panel
              line, decal trang trí và hiệu ứng có động chân thực.
            </p>
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Xem chi tiết
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center p-8">
            <img
              src="/images/logoGundam.webp"
              alt="Gundam Model"
              className="h-80 w-auto object-contain"
            />
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </section>
      {/* Welcome Message */}
      {/* <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            Xin chào, {currentUser?.user.userName || "Khách hàng"}!
          </h2>
          <p className="text-gray-700">
            Chào mừng bạn đến với Nhieuthuay. Khám phá các sản phẩm độc đáo chưa
            từng xuất hiện tại thị trường Việt Nam.
          </p>
        </div>
      </section> */}{" "}
      {/* Pre-order Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Sản phẩm đang mở Pre-order
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Thời gian cần hàng pre-order: Sẽ khi chúng tôi nhận được hàng, dự
            kiến thành tiên xuất mail thông báo 15 ngày. Giao hàng thành công từ
            5-7 ngày
          </p>

          <div className="relative">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10">
              <ChevronLeft size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
              {[
                { name: "Mô hình cá đuối cơ khí", countdown: "05:01:48:59" },
                { name: "Mô hình cá đuối cơ khí", countdown: "05:01:48:59" },
                { name: "Mô hình cá đuối cơ khí", countdown: "05:01:48:59" },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 text-center"
                >
                  <img
                    src={`https://picsum.photos/200/150?random=${index + 20}`}
                    alt={product.name}
                    className="w-32 h-24 object-cover mx-auto mb-4 rounded"
                  />
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {product.name}
                  </h3>
                  <div className="text-lg font-mono font-bold text-gray-700 mb-4">
                    {product.countdown}
                  </div>
                  <button className="bg-orange-500 text-white px-6 py-2 rounded font-medium hover:bg-orange-600 transition">
                    ⚠️ ĐĂNG KÝ ĐẶT TRƯỚC
                  </button>
                </div>
              ))}
            </div>

            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full z-10">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>
      {/* Available Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 border-b-2 border-dashed border-blue-300 pb-4">
            Sản phẩm hiện có
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-2 border-dashed border-blue-300 p-6 rounded-lg">
            {[
              {
                name: "KEYSHE LUNAR 01 - Bản phẩm có tích hợp đèn RGB cảm biến âm thanh",
                price: "4.000.000",
              },
              {
                name: "KEYSHE LUNAR 01 - Bản phẩm có tích hợp đèn RGB cảm biến âm thanh",
                price: "4.000.000",
              },
              {
                name: "KEYSHE LUNAR 01 - Bản phẩm có tích hợp đèn RGB cảm biến âm thanh",
                price: "4.000.000",
              },
              {
                name: "KEYSHE LUNAR 01 - Bản phẩm có tích hợp đèn RGB cảm biến âm thanh",
                price: "4.000.000",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${index + 30}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 text-gray-800 leading-tight">
                    {product.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-blue-600 text-sm">
                      Sản phẩm đang bán
                    </span>
                    <div className="text-green-600 text-sm">
                      ✓ đã có sẵn hàng tại kho Website
                    </div>
                  </div>
                  <div className="font-bold text-lg text-gray-800 mb-3">
                    {product.price} VND
                  </div>
                  <button className="w-full bg-blue-900 text-white py-2 rounded font-medium hover:bg-blue-800 transition text-sm">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Partner Brands */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Đối tác thương hiệu tại Nhieuthuay
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Chúng tôi hợp tác với các thương hiệu hàng đầu để mang đến sản phẩm
            chính hãng, chất lượng cao và trải nghiệm mua sắm tốt nhất cho khách
            hàng.
          </p>

          {/* Brand logos grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
            <div className="flex justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png"
                alt="Amazon"
                className="h-8 grayscale"
              />
            </div>
            <div className="flex justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/200px-Amazon_Web_Services_Logo.svg.png"
                alt="AWS"
                className="h-8 grayscale"
              />
            </div>
            <div className="flex justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/200px-LinkedIn_logo_initials.png"
                alt="LinkedIn"
                className="h-8 grayscale"
              />
            </div>
            <div className="flex justify-center">
              <div className="text-2xl font-bold text-gray-400">INTUIT</div>
            </div>
            <div className="flex justify-center">
              <div className="text-2xl font-bold text-gray-400">Dropbox</div>
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">
                FAST COMPANY
              </div>
            </div>

            <div className="flex justify-center">
              <div className="text-2xl font-bold text-gray-400">Inc.</div>
            </div>
            <div className="flex justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0d/Disney_logo.svg/200px-Disney_logo.svg.png"
                alt="Disney"
                className="h-8 grayscale"
              />
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">SEQUOIA</div>
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">SHOTDECK</div>
            </div>
            <div className="flex justify-center">
              <div className="text-2xl font-bold text-gray-400">Meta</div>
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">MAVEN</div>
            </div>

            <div className="flex justify-center col-start-2">
              <div className="text-xl font-bold text-gray-400">FRWS</div>
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">Monotype</div>
            </div>
            <div className="flex justify-center">
              <div className="text-xl font-bold text-gray-400">nitro</div>
            </div>
          </div>
        </div>
      </section>
      {/* Flash Sale */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-blue-600 font-medium mb-2">
                Flash sale đang diễn ra
              </p>
              <h2 className="text-3xl font-bold text-gray-800">
                ⚡ FLASH SALE 24H
              </h2>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="bg-blue-900 text-white text-2xl font-bold px-4 py-2 rounded">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600 mt-1">GIỜ</div>
              </div>
              <div className="text-2xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="bg-blue-900 text-white text-2xl font-bold px-4 py-2 rounded">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600 mt-1">PHÚT</div>
              </div>
              <div className="text-2xl font-bold text-gray-400">:</div>
              <div className="text-center">
                <div className="bg-blue-900 text-white text-2xl font-bold px-4 py-2 rounded">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600 mt-1">GIÂY</div>
              </div>
            </div>
          </div>

          {/* Flash Sale Products */}
          <div className="relative">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-2 rounded-full z-10">
              <ChevronLeft size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12">
              {[
                {
                  name: "PG Unicorn Gundam",
                  oldPrice: "415.000",
                  newPrice: "365.200",
                  discount: "12%",
                },
                {
                  name: "PG Strike Gundam",
                  oldPrice: "7.500.000",
                  newPrice: "6.120.000",
                  discount: "18%",
                },
                {
                  name: "PG Astray Blue Frame",
                  oldPrice: "8.000.000",
                  newPrice: "7.200.000",
                  discount: "10%",
                },
                {
                  name: "PG Wing Gundam Zero EW",
                  oldPrice: "5.500.000",
                  newPrice: "4.650.000",
                  discount: "15%",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={`https://picsum.photos/300/300?random=${index + 10}`}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{product.discount}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                    <div className="mb-2">
                      <span className="text-gray-500 line-through text-sm">
                        Giá niêm yết: {product.oldPrice} VND
                      </span>
                    </div>
                    <div className="font-bold text-red-600 text-lg mb-3">
                      {product.newPrice} VND
                    </div>
                    <button className="w-full bg-orange-500 text-white py-2 rounded font-medium hover:bg-orange-600 transition text-sm">
                      Chọn mua
                    </button>
                    <button className="w-full bg-blue-900 text-white py-2 rounded font-medium hover:bg-blue-800 transition text-sm mt-2">
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white p-2 rounded-full z-10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>{" "}
      {/* Newsletter */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Đăng ký nhận thông tin</h2>
          <p className="mb-6 max-w-xl mx-auto">
            Nhận thông tin mới nhất về sản phẩm, khuyến mãi và sự kiện đặc biệt
            từ Nhieuthuay.
          </p>

          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Địa chỉ email của bạn"
              className="flex-grow px-4 py-2 rounded-l text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 px-6 py-2 rounded-r font-medium transition"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomeCustomer;
