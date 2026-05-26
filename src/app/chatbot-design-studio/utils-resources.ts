export const BRAND_BASE_INFO: { [key: string] : string | boolean } ={
    COMPANY_NAME: "ChatCase",
    BRAND_NAME: "ChatCase",
    COMPANY_SITE_NAME:"chatcase.com.br",
    COMPANY_SITE_URL:"https://chatcase.com.br",
    CONTACT_US_EMAIL: "redacted@example.invalid",
    FAVICON: "assets/logos/chatcase-icon.svg",
    META_TITLE:"Estúdio de Fluxos",
    DOCS: false,
    COMMUNITY_SECTION: true,
    LOGOUT_ENABLED: false
}

export const LOGOS_ITEMS: { [key: string] : { label: string | boolean, icon: string }} ={
    COMPANY_LOGO: {label: BRAND_BASE_INFO.COMPANY_NAME,  icon: 'assets/logos/chatcase-logo.svg'},
    COMPANY_LOGO_NO_TEXT: {label: BRAND_BASE_INFO.COMPANY_NAME, icon: 'assets/logos/chatcase-icon.svg'},
    BASE_LOGO: {label: BRAND_BASE_INFO.BRAND_NAME,  icon: 'assets/logos/chatcase-logo.svg'},
    BASE_LOGO_NO_TEXT: {label: BRAND_BASE_INFO.BRAND_NAME, icon: 'assets/logos/chatcase-icon.svg'},
    BASE_LOGO_WHITE: { label: BRAND_BASE_INFO.BRAND_NAME, icon: 'assets/logos/chatcase-logo-white.svg'},
    BASE_LOGO_WHITE_NO_TEXT: { label: BRAND_BASE_INFO.BRAND_NAME, icon: 'assets/logos/chatcase-logo-white.svg'},
    BASE_LOGO_GRAY: { label: BRAND_BASE_INFO.BRAND_NAME, icon: 'assets/logos/chatcase-logo.svg'}
}

export const MEDIA: { [key: string]: { src: string, text: string, description: string}}= {
    RULES: { src: "", text: "CDSSplashScreen.YouHaveNoRules", description: "CDSSplashScreen.LearnAboutAI"},
    GLOBALS: { src: "", text: "CDSGlobals.NoGlobalVariables", description: ""},
}
