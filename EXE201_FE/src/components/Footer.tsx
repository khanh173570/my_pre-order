import React from "react";
import { Facebook, Youtube, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-t border-b border-dotted border-blue-100">
          {/* Order & Support */}
          <div>
            <h3 className="font-bold text-white mb-4">Đặt hàng & Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Chính sách bán hàng
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Điều khoản bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="h">
                  Điều kiện chung
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Liên hệ chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* About Nhieuthuay */}
          <div>
            <h3 className="font-bold text-white mb-4">Về Nhieuthuay</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Tầm nhìn - Sứ mệnh - Giá trị
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Chính sách trách nhiệm
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Đối tác
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-white mb-4">Mạng xã hội</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center">
                  <Facebook className="mr-2" size={20} />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <Youtube className="mr-2" size={20} />
                  <span>Youtube</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-centere">
                  <Instagram className="mr-2" size={20} />
                  <span>Message</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <svg
                    className="mr-2"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                  </svg>
                  <span>Zalo</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Promotions */}
          <div>
            <h3 className="font-bold text-white mb-4">
              Nhận nhiều khuyến mãi hơn tại
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a href="#" className="block">
                <img
                  src="https://shopee.sg/images/shopee-logo.svg"
                  alt="Shopee Mall"
                  className="h-8"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://lzd-img-global.slatic.net/g/tps/tfs/TB1SFmHkY9YBuNjy0FgXXcxcXXa-190-45.png"
                  alt="Lazada Mall"
                  className="h-8"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="py-6 text-sm text-white ">
          <p>Sản xuất và chịu trách nhiệm về hàng hoá công ty N&N</p>
          <p>Giấy CNĐT: 411043002851 do UBND TP HCM cấp ngày 28/8/2024</p>
          <p>
            Địa chỉ: 40 đường số 7, KDC, P.Long Trường, TP Thủ Đức, Việt Nam
          </p>
          <p>Điện thoại: 18008300</p>
        </div>

        {/* Copyright */}
        <div className="py-4 flex flex-wrap justify-between items-center border-t border-dotted border-blue-100">
          <p className="text-sm text-white">
            © 2025 Nhieuthuay Vietnam. All rights reserved.
          </p>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-white">Kết Nối với Chúng Tôi</span>
            <a href="#" className="text-white hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white hover:text-white">
              <Youtube size={20} />
            </a>
            <a href="#" className="text-white hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white hover:text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
