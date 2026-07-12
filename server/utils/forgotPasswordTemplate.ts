interface ForgotPasswordTemplateParams {
    name: string;
    otp: string | number;
}

const forgotPasswordTemplate = ({ name, otp }: ForgotPasswordTemplateParams): string => {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #121214; padding: 40px; border: 1px solid #27272A; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35); color: #E4E4E7;">
      
      <div style="text-align: center; margin-bottom: 32px;">
         <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">COMMAND CENTER</h1>
         <p style="color: #A1A1AA; font-size: 13px; margin: 5px 0 0 0; letter-spacing: 2px; text-transform: uppercase;">Secure Recovery Protocol</p>
         <div style="width: 40px; height: 3px; background-color: #3F3F46; margin: 12px auto;"></div>
      </div>

      <div style="padding-top: 10px;">
        <h2 style="color: #FFFFFF; font-size: 18px; font-weight: 700; margin-bottom: 16px; text-align: center; letter-spacing: -0.3px;">Reset Administrative Password</h2>
        
        <p style="color: #A1A1AA; font-size: 15px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
          Hello <strong>${name}</strong>,<br>
          We received a security credential request from your terminal session. Use the high-priority verification token below to securely process your password update sequence.
        </p>

        <div style="background-color: #18181B; border-radius: 12px; padding: 30px 20px; text-align: center; border: 1px dashed #3F3F46; margin-bottom: 32px;">
          <span style="display: block; font-size: 11px; font-weight: 700; color: #A1A1AA; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">One-Time Security Token (OTP)</span>
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #FFFFFF; letter-spacing: 8px; display: block; white-space: nowrap;">${otp}</span>
        </div>

        <div style="background-color: #18181B; border-left: 4px solid #A1A1AA; padding: 16px; margin-bottom: 32px; border-radius: 4px;">
          <p style="color: #E4E4E7; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong style="color: #FFFFFF;">Expiration:</strong> This security token expires exactly <strong style="color: #FFFFFF;">1 hour</strong> from dispatch. Do not expose this payload string to secondary personnel.
          </p>
        </div>

        <p style="color: #71717A; font-size: 13px; line-height: 1.5; text-align: center; padding: 0 20px;">
          If you did not initiate this authorization request, no actions are required. Your master access keys remain unaffected.
        </p>

        <hr style="border: 0; border-top: 1px solid #27272A; margin: 32px 0;">

        <p style="color: #52525B; font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
          &copy; 2026 Crisis Triage Network System. <br> Protected Infrastructure Environment.
        </p>
      </div>
    </div>
  `;
};

export default forgotPasswordTemplate;