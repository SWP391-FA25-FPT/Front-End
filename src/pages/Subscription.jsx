import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AppLayout from "../components/layout/AppLayout";
import { Typography, Row, Col, Card, Button, Modal, Radio, Tag, Spin, message } from "antd";
import PayPalScript from "../components/PayPalScript";
import PayPalButton from "../components/PayPalButton";
import { capturePayPalOrder } from "../apis/paypal";
import { Icon } from "@iconify/react";
import {
  getSubscriptionPlans,
  createSubscription,
  confirmPayment,
  getMySubscription,
} from "../apis/subscription";
import "./style/Subscription.css";

const { Title, Text, Paragraph } = Typography;

const Subscription = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    fetchData();
    handlePayPalReturn();
  }, []);

  const handlePayPalReturn = async () => {
    const paymentStatus = searchParams.get('payment');
    const token = searchParams.get('token');
    
    if (paymentStatus === 'success' && token) {
      // Get stored plan details
      const planType = sessionStorage.getItem('paypalPlanType');
      const planDuration = sessionStorage.getItem('paypalPlanDuration');
      const orderId = sessionStorage.getItem('paypalOrderId');
      const processedKey = `paypal_processed_${orderId}`;
      
      // Check if this order was already processed
      if (sessionStorage.getItem(processedKey)) {
        // Already processed, just clean up and redirect
        sessionStorage.removeItem('paypalPlanType');
        sessionStorage.removeItem('paypalPlanDuration');
        sessionStorage.removeItem('paypalOrderId');
        navigate('/subscription', { replace: true });
        return;
      }
      
      if (planType && planDuration && orderId && user?._id) {
        try {
          message.loading({ content: 'Đang xử lý thanh toán...', key: 'paypal-capture' });
          
          // Mark as processing to prevent duplicate attempts
          sessionStorage.setItem(processedKey, 'true');
          
          const result = await capturePayPalOrder(orderId, planType, planDuration, user._id);
          
          if (result.success) {
            const msg = result.status === 'ALREADY_PROCESSED' 
              ? 'Thanh toán đã được xử lý trước đó.'
              : 'Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.';
            message.success({ content: msg, key: 'paypal-capture', duration: 3 });
            // Clear session storage
            sessionStorage.removeItem('paypalPlanType');
            sessionStorage.removeItem('paypalPlanDuration');
            sessionStorage.removeItem('paypalOrderId');
            // Refresh user and subscription data
            if (refreshUser) await refreshUser();
            fetchData();
            // Clean URL
            navigate('/subscription', { replace: true });
          } else {
            sessionStorage.removeItem(processedKey);
            message.error({ content: 'Lỗi khi xác nhận thanh toán', key: 'paypal-capture' });
          }
        } catch (err) {
          sessionStorage.removeItem(processedKey);
          message.error({ content: 'Lỗi khi xử lý thanh toán: ' + err.message, key: 'paypal-capture' });
        }
      }
    } else if (paymentStatus === 'cancel') {
      message.warning('Bạn đã hủy thanh toán PayPal');
      // Clear session storage
      sessionStorage.removeItem('paypalPlanType');
      sessionStorage.removeItem('paypalPlanDuration');
      sessionStorage.removeItem('paypalOrderId');
      navigate('/subscription', { replace: true });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Lấy danh sách gói
    const plansResponse = await getSubscriptionPlans();
    if (plansResponse.success) {
      setPlans(plansResponse.data);
    }

    // Lấy subscription hiện tại
    const subResponse = await getMySubscription();
    if (subResponse.success && subResponse.data) {
      setCurrentSubscription(subResponse.data);
    }

    setLoading(false);
  };

  const handleSubscribe = async (planType, duration) => {
    if (!plans) {
      message.warning('Vui lòng đợi dữ liệu gói được tải.');
      return;
    }
    setSelectedPlan({ planType, planDuration: duration });
    // Debug log for troubleshooting plan selection
    console.log('handleSubscribe:', { planType, duration, plans });
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;
    setProcessLoading(true);
    // Step 1: Create subscription
    const createResponse = await createSubscription({
      planType: selectedPlan.planType,
      planDuration: selectedPlan.duration,
      paymentMethod,
    });
    if (!createResponse.success) {
      message.error(createResponse.error || "Lỗi khi tạo subscription");
      setProcessLoading(false);
      return;
    }
    // Step 2: Confirm payment (for non-PayPal)
    const confirmResponse = await confirmPayment({
      subscriptionId: createResponse.data.subscription._id,
      paymentId: "MOCK_PAYMENT_" + Date.now(),
    });
    if (confirmResponse.success) {
      message.success("Thanh toán thành công! Tài khoản của bạn đã được nâng cấp.");
      setShowPaymentModal(false);
      setSelectedPlan(null);
      if (refreshUser) {
        await refreshUser();
      }
      fetchData();
    } else {
      message.error(confirmResponse.error || "Lỗi khi xác nhận thanh toán");
    }
    setProcessLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // Helper function to check if a plan is currently active
  const isCurrentlyActive = (planType, planDuration) => {
    if (!currentSubscription || currentSubscription.status !== "active") return false;
    return currentSubscription.planType === planType && currentSubscription.planDuration === planDuration;
  };

  // Define subscription packages
  const subscriptionPackages = [
    {
      key: "free",
      title: "Cơ bản",
      subtitle: "Miễn phí – Dành cho người mới bắt đầu",
      price: 0,
      priceText: "0 ₫/tháng",
      features: [
        "Tạo tối đa 10 công thức mỗi tháng",
        "Tạo tối đa 7 kế hoạch bữa ăn mỗi tháng",
        "Truy cập thư viện công thức cơ bản",
        "Lưu trữ 20 công thức yêu thích",
        "Hỗ trợ qua email",
      ],
      disabled: true,
      isCurrentPlan: !currentSubscription || currentSubscription.status !== "active",
    },
    {
      key: "basic-monthly",
      title: "Cao cấp",
      subtitle: "Dành cho người dùng nâng cao",
      price: 99000,
      priceText: "99.000 ₫/tháng",
      popular: false,
      features: [
        "Tạo tối đa 50 công thức mỗi tháng",
        "Tạo tối đa 30 kế hoạch bữa ăn mỗi tháng",
        "Truy cập toàn bộ thư viện công thức",
        "Lưu trữ không giới hạn công thức yêu thích",
        "Hỗ trợ qua email và chat",
        "Không quảng cáo",
      ],
      planType: "basic",
      planDuration: "monthly",
      isCurrentPlan: isCurrentlyActive("basic", "monthly"),
    },
    {
      key: "premium-monthly",
      title: "Chuyên nghiệp",
      subtitle: "Dành cho người dùng chuyên nghiệp",
      price: 199000,
      priceText: "199.000 ₫/tháng",
      popular: true,
      features: [
        "Tạo công thức không giới hạn",
        "Tạo kế hoạch bữa ăn không giới hạn",
        "Tất cả tính năng của gói Cao cấp",
        "Tạo kế hoạch bữa ăn theo tuần",
        "Công cụ phân tích dinh dưỡng nâng cao",
        "Tạo thực đơn nhà hàng",
        "Tính toán chi phí nguyên liệu",
        "Hỗ trợ ưu tiên 24/7",
        "Đào tạo 1-1 với đầu bếp chuyên nghiệp",
      ],
      planType: "premium",
      planDuration: "monthly",
      isCurrentPlan: isCurrentlyActive("premium", "monthly"),
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: 20 }}>Đang tải...</Text>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="subscription-page-container">
        {/* Header */}
        <div className="subscription-header-section">
          <Title level={2} className="subscription-main-title">
            Chọn gói dịch vụ phù hợp với bạn
          </Title>
          <Paragraph className="subscription-subtitle">
            Chúng tôi cung cấp nhiều gói dịch vụ khác nhau để đáp ứng nhu cầu của bạn. 
            Tất cả các gói đều bao gồm các tính năng cơ bản của Meta-Meal.
          </Paragraph>
        </div>

        {/* Current Subscription Alert */}
        {currentSubscription && currentSubscription.status === "active" && (
          <Card 
            className="current-subscription-alert"
            style={{
              marginBottom: 30,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
            }}
          >
            <Row align="middle" gutter={16}>
              <Col>
                <Icon icon="mdi:check-circle" width="40" height="40" style={{ color: "white" }} />
              </Col>
              <Col flex="1">
                <Title level={4} style={{ color: "white", margin: 0 }}>
                  Gói hiện tại: {currentSubscription.planType} - {currentSubscription.planDuration}
                </Title>
                <Text style={{ color: "white" }}>
                  Có hiệu lực đến: {formatDate(currentSubscription.endDate)}
                </Text>
              </Col>
            </Row>
          </Card>
        )}

        {/* Monthly Plans Section */}
        <div className="plans-section">
          <Title level={3} className="section-title">
            Gói hàng tháng
          </Title>

          <Row gutter={[24, 24]} justify="center">
            {subscriptionPackages.map((pkg) => (
              <Col xs={24} sm={24} md={8} key={pkg.key}>
                <Card
                  className={`subscription-card ${pkg.popular ? 'popular-card' : ''} ${pkg.isCurrentPlan ? 'current-plan' : ''}`}
                  hoverable={!pkg.disabled && !pkg.isCurrentPlan}
                >
                  {pkg.popular && (
                    <div className="popular-badge">
                      <Tag color="orange" style={{ margin: 0, fontWeight: 600 }}>
                        Phổ biến nhất
                      </Tag>
                    </div>
                  )}

                  {pkg.isCurrentPlan && (
                    <div className="current-badge">
                      <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>
                        Gói hiện tại
                      </Tag>
                    </div>
                  )}

                  <div className="card-header">
                    <Title level={4} className="plan-title">
                      {pkg.title}
                    </Title>
                    <Text className="plan-subtitle">{pkg.subtitle}</Text>
                  </div>

                  <div className="card-price">
                    <Title level={2} className="price-amount">
                      {pkg.price === 0 ? "0 ₫" : formatPrice(pkg.price)}
                    </Title>
                    <Text className="price-period">/tháng</Text>
                  </div>

                  <div className="card-features">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <Icon
                          icon="mdi:check-circle"
                          width="20"
                          height="20"
                          style={{ color: "#52c41a", minWidth: 20 }}
                        />
                        <Text className="feature-text">{feature}</Text>
                      </div>
                    ))}
                  </div>

                  <div className="card-button-wrapper">
                    <Button
                      type={pkg.popular ? "primary" : "default"}
                      size="large"
                      block
                      className="subscribe-button"
                      disabled={pkg.disabled || pkg.isCurrentPlan}
                      onClick={() => handleSubscribe(pkg.planType, pkg.planDuration)}
                      style={{
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                        ...(pkg.popular && {
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }),
                      }}
                    >
                      {pkg.disabled
                        ? "Gói hiện tại"
                        : pkg.isCurrentPlan
                        ? "Đang sử dụng"
                        : "Đăng ký ngay"}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Yearly Plans Section */}
        {plans && (plans.basic?.yearly || plans.premium?.yearly) && (
          <div className="plans-section" style={{ marginTop: 60 }}>
            <Title level={3} className="section-title">
              Gói hàng năm <Tag color="red">Tiết kiệm 20%</Tag>
            </Title>

            <Row gutter={[24, 24]} justify="center">
              {plans.basic?.yearly && (
                <Col xs={24} sm={24} md={12}>
                  <Card className={`subscription-card ${isCurrentlyActive("basic", "yearly") ? 'current-plan' : ''}`} hoverable={!isCurrentlyActive("basic", "yearly")}>
                    {isCurrentlyActive("basic", "yearly") && (
                      <div className="current-badge">
                        <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>
                          Gói hiện tại
                        </Tag>
                      </div>
                    )}

                    <div className="card-header">
                      <Title level={4} className="plan-title">
                        Cao cấp - Hàng năm
                      </Title>
                      <Text className="plan-subtitle">Tiết kiệm hơn với gói năm</Text>
                    </div>

                    <div className="card-price">
                      <Title level={2} className="price-amount">
                        {formatPrice(plans.basic.yearly.price)}
                      </Title>
                      <Text className="price-period">/năm</Text>
                    </div>

                    <div className="savings-badge">
                      <Text style={{ color: "#52c41a", fontWeight: 600 }}>
                        Tiết kiệm {formatPrice(99000 * 12 - plans.basic.yearly.price)} so với gói tháng
                      </Text>
                    </div>

                    <div className="card-button-wrapper">
                      <Button
                        type="default"
                        size="large"
                        block
                        className="subscribe-button"
                        onClick={() => handleSubscribe("basic", "yearly")}
                        disabled={isCurrentlyActive("basic", "yearly")}
                        style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                      >
                        {isCurrentlyActive("basic", "yearly") ? "Đang sử dụng" : "Đăng ký ngay"}
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}

              {plans.premium?.yearly && (
                <Col xs={24} sm={24} md={12}>
                  <Card className={`subscription-card popular-card ${isCurrentlyActive("premium", "yearly") ? 'current-plan' : ''}`} hoverable={!isCurrentlyActive("premium", "yearly")}>
                    {isCurrentlyActive("premium", "yearly") ? (
                      <div className="current-badge">
                        <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>
                          Gói hiện tại
                        </Tag>
                      </div>
                    ) : (
                      <div className="popular-badge">
                        <Tag color="orange" style={{ margin: 0, fontWeight: 600 }}>
                          Tiết kiệm nhất
                        </Tag>
                      </div>
                    )}

                    <div className="card-header">
                      <Title level={4} className="plan-title">
                        Chuyên nghiệp - Hàng năm
                      </Title>
                      <Text className="plan-subtitle">Lựa chọn tốt nhất cho chuyên gia</Text>
                    </div>

                    <div className="card-price">
                      <Title level={2} className="price-amount">
                        {formatPrice(plans.premium.yearly.price)}
                      </Title>
                      <Text className="price-period">/năm</Text>
                    </div>

                    <div className="savings-badge">
                      <Text style={{ color: "#52c41a", fontWeight: 600 }}>
                        Tiết kiệm {formatPrice(199000 * 12 - plans.premium.yearly.price)} so với gói tháng
                      </Text>
                    </div>

                    <div className="card-button-wrapper">
                      <Button
                        type="primary"
                        size="large"
                        block
                        className="subscribe-button"
                        onClick={() => handleSubscribe("premium", "yearly")}
                        disabled={isCurrentlyActive("premium", "yearly")}
                        style={{
                          height: 48,
                          fontSize: 16,
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        {isCurrentlyActive("premium", "yearly") ? "Đang sử dụng" : "Đăng ký ngay"}
                      </Button>
                    </div>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}

        {/* Payment Modal */}
        <Modal
          title={
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ margin: 0 }}>
                Xác nhận thanh toán
              </Title>
            </div>
          }
          open={showPaymentModal}
          onCancel={() => {
            if (!processLoading) {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }
          }}
          footer={null}
          width={500}
          centered
        >
          {selectedPlan && plans && (() => { console.log('Modal Render:', { selectedPlan, plans }); return true; })() && (
            <div className="payment-modal-content">
              <Card className="payment-summary-card" style={{ marginBottom: 20 }}>
                <Title level={5}>Thông tin gói đăng ký</Title>
                <div className="summary-row">
                  <Text strong>Gói:</Text>
                  <Text>
                    {(() => {
                      const planType = selectedPlan.planType;
                      const planDuration = selectedPlan.planDuration;
                      const planObj = plans && plans[planType] && plans[planType][planDuration];
                      if (planObj && planObj.name) {
                        return planObj.name;
                      } else {
                        return <span style={{color: 'red'}}>Không tìm thấy tên gói</span>;
                      }
                    })()}
                  </Text>
                </div>
                <div className="summary-row">
                  <Text strong>Số tiền:</Text>
                  <Text style={{ fontSize: 18, color: "#1890ff", fontWeight: 600 }}>
                    {(() => {
                      const planType = selectedPlan.planType;
                      const planDuration = selectedPlan.planDuration;
                      const planObj = plans && plans[planType] && plans[planType][planDuration];
                      if (planObj && typeof planObj.price === 'number') {
                        return formatPrice(planObj.price);
                      } else {
                        return <span style={{color: 'red'}}>Không tìm thấy giá gói này</span>;
                      }
                    })()}
                  </Text>
                </div>
              </Card>

              <div style={{ marginBottom: 20 }}>
                <Title level={5}>Phương thức thanh toán</Title>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <Radio.Button
                    value="credit_card"
                    style={{ width: "100%", marginBottom: 10, height: 48 }}
                  >
                    <Icon icon="mdi:credit-card" width="20" height="20" style={{ marginRight: 8 }} />
                    Thẻ tín dụng
                  </Radio.Button>
                  <Radio.Button
                    value="debit_card"
                    style={{ width: "100%", marginBottom: 10, height: 48 }}
                  >
                    <Icon icon="mdi:credit-card-outline" width="20" height="20" style={{ marginRight: 8 }} />
                    Thẻ ghi nợ
                  </Radio.Button>
                  <Radio.Button value="paypal" style={{ width: "100%", height: 48 }}>
                    <Icon icon="logos:paypal" width="20" height="20" style={{ marginRight: 8 }} />
                    PayPal
                  </Radio.Button>
                </Radio.Group>
                {paymentMethod === "paypal" && (
                  <>
                    <PayPalScript />
                    <div style={{ marginTop: 16 }}>
                      {(() => {
                        const planType = selectedPlan.planType;
                        const planDuration = selectedPlan.planDuration;
                        const planObj = plans && plans[planType] && plans[planType][planDuration];
                        const amount = planObj && typeof planObj.price === 'number' ? planObj.price : 0;
                        if (amount <= 0) {
                          return (
                            <Text type="danger">Số tiền thanh toán phải lớn hơn 0 để sử dụng PayPal.</Text>
                          );
                        }
                        return (
                          <PayPalButton
                            amount={amount}
                            planType={planType}
                            planDuration={planDuration}
                            onSuccess={async (details) => {
                              message.success("Đang chuyển đến PayPal...");
                              setShowPaymentModal(false);
                              setSelectedPlan(null);
                            }}
                            onError={(err) => {
                              message.error("Lỗi khi tạo đơn PayPal: " + err.message);
                            }}
                          />
                        );
                      })()}
                    </div>
                  </>
                )}
              </div>

              <Card
                className="demo-notice-card"
                style={{
                  background: "#fff3cd",
                  borderColor: "#ffc107",
                  marginBottom: 20,
                }}
              >
                <Text>
                  <Icon
                    icon="mdi:information"
                    width="20"
                    height="20"
                    style={{ marginRight: 8, color: "#856404" }}
                  />
                  Đây là môi trường demo. Nhấn "Xác nhận" để mô phỏng thanh toán thành công.
                </Text>
              </Card>

              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    size="large"
                    block
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPlan(null);
                    }}
                    disabled={processLoading}
                  >
                    Hủy
                  </Button>
                </Col>
                <Col span={12}>
                  {paymentMethod !== "paypal" && (
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleConfirmPayment}
                      loading={processLoading}
                      style={{
                        background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                        border: "none",
                      }}
                    >
                      Xác nhận thanh toán
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
};

export default Subscription;
