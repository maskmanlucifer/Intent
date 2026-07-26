import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
    APP_VERSION,
    getCurrentVersionFeatures,
    setLastSeenVersion,
} from "../../constants/version";
import "./index.scss";

const FEEDBACK_EMAIL = "brightpixellabs@gmail.com";

interface WhatsNewModalProps {
    open: boolean;
    onClose: () => void;
    hasUpdates: boolean;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({
    open,
    onClose,
    hasUpdates,
}) => {
    const { t } = useTranslation();
    const features = getCurrentVersionFeatures();

    const handleFeedbackClick = () => {
        const subject = encodeURIComponent(
            "Intent app feedback or feature request",
        );
        window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}`;
    };

    const handleClose = async () => {
        try {
            if (hasUpdates) {
                await setLastSeenVersion(APP_VERSION);
            }
        } catch (error) {
            console.error("Error saving last seen version:", error);
        } finally {
            onClose();
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            title={
                <span className="whats-new-modal-header">
                    {t("whatsNew.title")}
                </span>
            }
            centered={true}
            closeIcon={<CloseOutlined style={{ fontSize: "14px" }} />}
            width={600}
            footer={[
                <Button
                    key="ok"
                    type="primary"
                    onClick={handleClose}
                    size="small"
                >
                    {t("whatsNew.gotIt")}
                </Button>,
            ]}
            onOk={handleClose}
            className="whats-new-modal"
        >
            <div className="whats-new-content">
                <div className="whats-new-updates-list">
                    {features.map((feature, index) => (
                        <div key={index} className="whats-new-update-item">
                            <h3 className="update-title">{t(feature.titleKey)}</h3>
                            <p className="update-description">
                                {t(feature.descriptionKey)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="whats-new-feedback-section">
                    <h4 className="feedback-title">{t("whatsNew.feedbackTitle")}</h4>
                    <Button
                        type="link"
                        size="small"
                        onClick={handleFeedbackClick}
                        className="feedback-submit-btn"
                    >
                        {t("whatsNew.submitFeedback")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default WhatsNewModal;
