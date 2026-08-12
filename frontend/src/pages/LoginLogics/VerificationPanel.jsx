import { motion ,  AnimatePresence } from 'framer-motion'

const VerificationPanel = ({
  email = '',
  onVerified,
  onResend,
  resendCooldown = 0,
}) => {
  return (

        <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "28px 10px 10px",
      width: "100%",
    }}
  >
    {/* Email Icon */}
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        marginBottom: 20,
        fontSize: 28,
      }}
    >
      ✉️
    </div>

    {/* Heading */}
    <h2
      style={{
        color: "white",
        fontSize: 23,
        fontWeight: 700,
        margin: "0 0 10px",
      }}
    >
      Verify your email
    </h2>

    {/* Description */}
    <p
      style={{
        color: "rgba(255,255,255,0.55)",
        fontSize: 14,
        lineHeight: 1.6,
        margin: "0 0 18px",
        maxWidth: 330,
      }}
    >
      We've sent a verification link to
    </p>

    {/* Email */}
    <div
      style={{
        width: "100%",
        maxWidth: 330,
        padding: "12px 16px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        fontSize: 14,
        fontWeight: 600,
        wordBreak: "break-word",
        marginBottom: 18,
      }}
    >
      {email}
    </div>

    {/* Information */}
    <p
      style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: 13,
        lineHeight: 1.6,
        margin: "0 0 24px",
        maxWidth: 320,
      }}
    >
      <strong>Can't find the email?</strong>
      <br />
      Check your Spam or Junk folder.
    </p>

    {/* Verified Button */}
    <button
      type="button"
      onClick={onVerified}
      style={{
        width: "100%",
        maxWidth: 330,
        padding: "13px 20px",
        borderRadius: 50,
        border: "none",
        background:
          "linear-gradient(135deg, var(--accent), var(--accent2))",
        color: "white",
        fontFamily: "Outfit, sans-serif",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 6px 24px var(--glow)",
        transition: "all 0.25s ease",
      }}
    >
      I've verified my email
    </button>

    {/* Resend */}
    <button
      type="button"
      onClick={onResend}
      disabled={resendCooldown > 0}
      style={{
        marginTop: 16,
        background: "none",
        border: "none",
        color: "var(--accent)",
        fontSize: 13,
        fontWeight: 500,
        padding: "6px 10px",
        opacity: resendCooldown > 0 ? 0.4 : 1,
        cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
      }}
    >
   {resendCooldown > 0
  ? `Resend in ${resendCooldown}s`
  : "Resend verification email"}
          </button>
        </motion.div>
        
      )}


export default VerificationPanel;