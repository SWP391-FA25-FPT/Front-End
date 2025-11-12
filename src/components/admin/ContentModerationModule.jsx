import React, { useState } from "react";
import { Select, Button, Tag, Modal } from "antd";
import { Icon } from "@iconify/react";
import "../../pages/style/ContentModeration.css";

export default function ContentModerationModule() {

  // Data mock recipe (có thêm content)
  const recipeReports = [
    {
      id: 1,
      title: "Gỏi Cuốn Tôm",
      category: "Món chính",
      priority: "Cao",
      user: "uyenfood",
      img: "https://images.unsplash.com/photo-1604908177321-46c77c425653?w=600",
      status: "pending",
      ingredients: [
        "200g tôm sú",
        "Bánh tráng",
        "Bún sợi",
        "Rau sống (xà lách, húng quế)",
        "Nước mắm, chanh, tỏi, ớt",
      ],
      steps: [
        "Luộc tôm với 1 ít muối trong 4-5 phút, bóc vỏ, để ráo.",
        "Ngâm bánh tráng với nước ấm 1-2 giây cho mềm.",
        "Xếp rau sống + bún + tôm lên bánh tráng.",
        "Cuộn chặt tay từ từ.",
        "Pha nước chấm: nước mắm + đường + chanh + tỏi + ớt, khuấy đều và thưởng thức."
      ],
    },
    {
      id: 2,
      title: "Smoothie Dâu Hạnh Nhân",
      category: "Đồ uống",
      priority: "Thấp",
      user: "healthybae",
      img: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600",
      status: "pending",
      ingredients: [
        "150g dâu tây",
        "200ml sữa hạnh nhân",
        "Một muỗng yến mạch",
        "Đá viên",
      ],
      steps: [
        "Rửa sạch dâu tây và cắt đôi.",
        "Cho dâu tây + sữa hạnh nhân + yến mạch vào máy xay.",
        "Xay trong 30-40 giây đến khi hỗn hợp mịn.",
        "Rót ra ly, thêm vài lát dâu trang trí và thưởng thức."
      ],
    },
    {
      id: 3,
      title: "Cơm Gà Nha Trang",
      category: "Món chính",
      priority: "Cao",
      user: "anhbep",
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
      status: "pending",
      ingredients: [
        "½ con gà ta",
        "Gạo dẻo",
        "Nước mắm gừng",
        "Rau răm, hành tím phi"
      ],
      steps: [
        "Luộc gà với gừng, hành tím trong 25 phút.",
        "Vớt gà ra, quét 1 lớp dầu ăn lên da để bóng đẹp.",
        "Dùng nước luộc gà để nấu cơm.",
        "Làm nước chấm gừng: giã gừng + tỏi + ớt + nước mắm + đường.",
        "Chặt gà, trình bày cùng cơm và rau răm."
      ],
    },
    {
      id: 4,
      title: "Bánh Flan",
      category: "Tráng miệng",
      priority: "Thấp",
      user: "sweetcooker",
      img: "https://images.unsplash.com/photo-1587248720292-76c3b7b90a17?w=600",
      status: "pending",
      ingredients: [
        "400ml sữa tươi",
        "5 quả trứng gà",
        "40g đường",
        "Nước cốt caramel"
      ],
      steps: [
        "Đun sữa với lửa nhỏ đến khi ấm (không đun sôi).",
        "Đánh trứng nhẹ tay, không tạo bọt.",
        "Trộn sữa + trứng + đường, lọc qua rây.",
        "Đổ hỗn hợp vào khuôn có sẵn lớp caramel.",
        "Hấp cách thủy 20 phút để nguội và cho vào tủ lạnh."
      ],
    },
    {
      id: 5,
      title: "Khoai Tây Chiên Air-fryer",
      category: "Snack",
      priority: "Cao",
      user: "fitlife",
      img: "https://images.unsplash.com/photo-1576100965326-b9f9b60f6516?w=600",
      status: "pending",
      ingredients: [
        "3 củ khoai tây",
        "1 muỗng dầu olive",
        "Muối & tiêu",
        "Paprika"
      ],
      steps: [
        "Gọt vỏ và cắt khoai thành thanh dài.",
        "Ngâm khoai trong nước muối 10 phút để giòn.",
        "Trộn khoai với dầu olive + muối + tiêu.",
        "Chiên bằng Air Fryer ở 180°C trong 15 phút.",
        "Rắc thêm paprika và thưởng thức."
      ],
    },
    {
      id: 6,
      title: "Chè Chuối",
      category: "Tráng miệng",
      priority: "Cao",
      user: "linda",
      img: "https://images.unsplash.com/photo-1562447579-b7432ccfe8e1?w=600",
      status: "pending",
      ingredients: [
        "3 quả chuối sứ",
        "200ml nước cốt dừa",
        "Hạt trân châu",
        "Đường"
      ],
      steps: [
        "Luộc trân châu đến khi trong suốt.",
        "Cắt chuối khoanh, rim với đường trong 5 phút.",
        "Đun cốt dừa với chuối + trân châu.",
        "Rắc mè rang và thưởng thức."
      ],
    },
    {
      id: 7,
      title: "Salad Hy Lạp",
      category: "Món chay",
      priority: "Thấp",
      user: "veganstyle",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
      status: "pending",
      ingredients: [
        "Dưa leo, cà chua bi",
        "Hành tây tím",
        "Phô mai feta",
        "Dầu olive + giấm balsamic"
      ],
      steps: [
        "Cắt nhỏ dưa leo + cà chua + hành tím.",
        "Trộn với phô mai feta.",
        "Rưới dầu olive + giấm balsamic và trộn đều.",
        "Thêm tiêu đen và thưởng thức."
      ],
    },
    {
      id: 8,
      title: "Trà Sữa Matcha",
      category: "Đồ uống",
      priority: "Thấp",
      user: "greenmatcha",
      img: "https://images.unsplash.com/photo-1582442055094-133bcd8f03d0?w=600",
      status: "pending",
      ingredients: [
        "Matcha",
        "Sữa tươi",
        "Trân châu đen",
        "Đường"
      ],
      steps: [
        "Pha matcha với nước nóng 70°C.",
        "Thêm sữa tươi + đá vào matcha.",
        "Cho trân châu đã nấu vào ly và khuấy đều.",
        "Thưởng thức."
      ],
    },
    {
      id: 9,
      title: "Bún Đậu Mắm Tôm",
      category: "Món chính",
      priority: "Cao",
      user: "saigonfood",
      img: "https://images.unsplash.com/photo-1616594039964-a8b2d9cd6d55?w=600",
      status: "pending",
      ingredients: [
        "Bún",
        "Đậu hũ chiên",
        "Mắm tôm",
        "Thịt luộc",
        "Rau sống"
      ],
      steps: [
        "Chiên đậu vàng giòn.",
        "Pha mắm tôm với tắc + đường + dầu ăn + ớt.",
        "Xếp bún + thịt + đậu + rau ra mẹt.",
        "Chấm mắm tôm và thưởng thức."
      ],
    },
    {
      id: 10,
      title: "Súp Bí Đỏ",
      category: "Món chay",
      priority: "Thấp",
      user: "heather",
      img: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600",
      status: "pending",
      ingredients: [
        "Bí đỏ",
        "Hành tây",
        "Bơ",
        "Sữa tươi không đường"
      ],
      steps: [
        "Phi hành tây với bơ.",
        "Cho bí đỏ vào xào 5 phút.",
        "Thêm nước và hầm đến khi mềm.",
        "Xay nhuyễn và thêm sữa tươi.",
        "Nêm muối + tiêu và thưởng thức."
      ],
    },
  ];
  const [filters, setFilters] = useState({ category: null, priority: null });
  const [recipes, setRecipes] = useState(recipeReports);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // lưu recipe để mở popup
  const [isModalOpen, setIsModalOpen] = useState(false); // mở popup


  const filteredData = recipes.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (filters.status && item.status !== filters.status) return false;
    return true;
  });

  const handleApprove = (id) => {
    console.log("Approved:", id);
    setIsModalOpen(false);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
    setIsModalOpen(false);
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };
  const updateStatus = (id, newStatus) => {
    setRecipes(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    setIsModalOpen(false);
  };

  return (
    <div className="admin-module-wrapper">

      {/* FILTER BAR */}
      <div className="admin-filter-bar">
        <Select
          placeholder="Loại món ăn"
          allowClear
          onChange={(value) => setFilters({ ...filters, category: value })}
          options={[
            { value: "Món chính", label: "Món chính" },
            { value: "Món chay", label: "Món chay" },
            { value: "Đồ uống", label: "Đồ uống" },
            { value: "Tráng miệng", label: "Tráng miệng" },
            { value: "Snack", label: "Snack" },
          ]}
        />

        <Select
          placeholder="Độ ưu tiên"
          allowClear
          onChange={(value) => setFilters({ ...filters, priority: value })}
          options={[
            { value: "Cao", label: "Cao" },
            { value: "Thấp", label: "Thấp" },
          ]}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          onChange={(value) => setFilters({ ...filters, status: value })}
          options={[
            { value: "pending", label: "Chưa duyệt" },
            { value: "approved", label: "Đã duyệt" },
            { value: "rejected", label: "Từ chối" },
          ]}
        />

      </div>

      {/* CARD LIST */}
      <div className="admin-card-grid">
        {filteredData.map((item) => (
          <div key={item.id} className="admin-card-fixed">
            <div>
              <div className="admin-card-tags">
                <Tag color="purple">{item.category}</Tag>
                <Tag color={item.priority === "Cao" ? "red" : "green"}>
                  {item.priority}
                </Tag>
              </div>

              <h4 className="admin-card-title">{item.title}</h4>
              <Tag
                color={
                  item.status === "approved"
                    ? "green"
                    : item.status === "rejected"
                      ? "red"
                      : "gold"
                }
                style={{ marginBottom: 8 }}
              >
                {item.status === "approved"
                  ? "Đã duyệt"
                  : item.status === "rejected"
                    ? "Từ chối"
                    : "Chưa duyệt"}
              </Tag>
              <p><strong>Người đăng:</strong> @{item.user}</p>
            </div>

            <div className="admin-card-actions">
              <Button type="text" icon={<Icon icon="mdi:eye-outline" width="18" />} onClick={() => openModal(item)}>
                Xem chi tiết
              </Button>

              {item.status === "pending" && (
                <div className="admin-approve-reject">
                  <Button type="primary" onClick={() => updateStatus(item.id, "approved")}>
                    Duyệt
                  </Button>
                  <Button danger onClick={() => updateStatus(item.id, "rejected")}>
                    Từ chối
                  </Button>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={650}
        title={`Xem trước công thức — ${selectedRecipe?.title}`}
      >
        <img
          src={selectedRecipe?.img}
          alt={selectedRecipe?.title}
          style={{ width: "100%", borderRadius: "12px", marginBottom: "16px" }}
        />

        <p><strong>Người đăng:</strong> @{selectedRecipe?.user}</p>

        <h4>📌 Nguyên liệu:</h4>
        <ul>
          {selectedRecipe?.ingredients.map((i, index) => (
            <li key={index}>{i}</li>
          ))}
        </ul>

        <h4>👩‍🍳 Các bước thực hiện:</h4>
        <ol>
          {selectedRecipe?.steps.map((i, index) => (
            <li key={index}>{i}</li>
          ))}
        </ol>

        {selectedRecipe?.status === "pending" && (
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button danger onClick={() => updateStatus(selectedRecipe?.id, "rejected")}>Từ chối</Button>
            <Button
              type="primary"
              onClick={() => updateStatus(selectedRecipe?.id, "approved")}
              style={{ marginLeft: 8 }}
            >
              Duyệt
            </Button>
          </div>
        )}

      </Modal>
    </div>
  );
}
