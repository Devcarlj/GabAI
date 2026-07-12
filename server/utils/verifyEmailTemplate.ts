interface EmailTemplateParams {
    name: string;
    url: string;
}

const verifyEmailTemplate = ({ name, url }: EmailTemplateParams): string => {
    return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #121214; padding: 40px; border-radius: 16px; border: 1px solid #27272A; color: #E4E4E7; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);">
        
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">COMMAND CENTER</h1>
            <p style="color: #A1A1AA; font-size: 13px; margin: 5px 0 0 0; letter-spacing: 2px; text-transform: uppercase;">Crisis Triage Network</p>
            <div style="width: 40px; height: 3px; background-color: #3F3F46; margin: 15px auto;"></div>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #E4E4E7;">Dear <strong>${name}</strong>,</p>
        
        <p style="font-size: 15px; line-height: 1.6; color: #A1A1AA; margin-bottom: 30px;">
            An administrative profile has been provisioned for you within the Crisis Triage Command Center. To finalize your authorization parameters and activate your terminal access, please verify your email address below.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" 
               style="background-color: #FFFFFF; color: #121214; padding: 14px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 700; font-size: 15px; letter-spacing: -0.2px; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);">
                Verify Account Terminal
            </a>
        </div>

        <p style="margin-top: 40px; font-size: 12px; color: #71717A; text-align: center; border-top: 1px solid #27272A; padding-top: 25px; line-height: 1.5;">
            If the button above does not process correctly, copy and paste this secure token URL into your network browser: <br>
            <a href="${url}" style="color: #FFFFFF; text-decoration: underline; word-break: break-all; display: inline-block; margin-top: 8px;">${url}</a>
        </p>

        <p style="font-size: 11px; color: #52525B; text-align: center; margin-top: 30px; letter-spacing: 0.5px;">
            &copy; 2026 Emergency Command & Triage Management System. System Restricted Access.
        </p>
    </div>
    `;
}

export default verifyEmailTemplate;