import { useConfig } from '@/hooks'

export const useSettingUrls = () => {
  const { contactAs, PrivacyPolicy, ServiceTerms } = useConfig()

  return {
    CONTACT_US_DISCORD_URL: contactAs,
    PRIVACY_POLICY_URL: PrivacyPolicy,
    SERVICE_TERMS_URL: ServiceTerms,
  }
}
