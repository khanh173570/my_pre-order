import React from "react";

const Policy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chính sách</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Chính sách đổi trả</h2>
          <p className="text-gray-600">
            {/* Policy content will be added here */}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Chính sách vận chuyển</h2>
          <p className="text-gray-600">
            {/* Shipping policy content will be added here */}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Chính sách bảo hành</h2>
          <p className="text-gray-600">
            {/* Warranty policy content will be added here */}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Policy;
