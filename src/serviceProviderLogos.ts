// Verified official agency, university, and City Hall logos stored as local static assets.
export type ServiceProviderLogoAsset = {
  image: string;
  source: string;
  aspect?: "seal" | "wide";
};

export const serviceProviderLogos: Record<string, ServiceProviderLogoAsset> = {
  "bpld-malaybalay": {
    image: "/images/offices/bpld.jpg",
    source: "City Government of Malaybalay — Business Permits & Licensing Division (BPLD)",
    aspect: "seal",
  },
  "dti-bukidnon": {
    image: "/images/agencies/dti.png",
    source: "https://www.dti.gov.ph/wp-content/uploads/2025/06/DTI-BP-masthead-01-scaled.png",
    aspect: "wide",
  },
  "sec-ipophl-gateway": {
    image: "/images/agencies/sec.png",
    source: "Securities and Exchange Commission (SEC) Philippines official wordmark",
    aspect: "wide",
  },
  "ccro-malaybalay": {
    image: "/images/offices/ccro.png",
    source: "City Government of Malaybalay — City Civil Registrar's Office (CCRO)",
    aspect: "seal",
  },
  "psa-bukidnon": {
    image: "/images/agencies/psa.png",
    source: "Philippine Statistics Authority (PSA) official seal",
    aspect: "seal",
  },
  "nbi-malaybalay": {
    image: "/images/agencies/nbi.png",
    source: "National Bureau of Investigation (NBI) official seal",
    aspect: "seal",
  },
  "pnp-malaybalay-clearance": {
    image: "/images/agencies/pnp.png",
    source: "Philippine National Police (PNP) official seal",
    aspect: "seal",
  },
  "sss-malaybalay": {
    image: "/images/agencies/sss.png",
    source: "https://www.sss.gov.ph/wp-content/uploads/2024/09/sss-logo-header-2.png",
    aspect: "wide",
  },
  "pagibig-malaybalay": {
    image: "/images/agencies/pagibig.png",
    source: "Home Development Mutual Fund (Pag-IBIG Fund) official logo",
    aspect: "seal",
  },
  "philhealth-malaybalay": {
    image: "/images/agencies/philhealth.png",
    source: "https://www.philhealth.gov.ph/images/ph_logobb.png",
    aspect: "wide",
  },
  "gsis-malaybalay": {
    image: "/images/agencies/gsis.png",
    source: "Government Service Insurance System (GSIS) official logo",
    aspect: "seal",
  },
  "cdrrmo-malaybalay": {
    image: "/images/offices/cdrrmo.jpg",
    source: "City Disaster Risk Reduction and Management Office (CDRRMO) Malaybalay",
    aspect: "seal",
  },
  "pagasa-noah-malaybalay": {
    image: "/images/agencies/pagasa.png",
    source: "DOST-PAGASA official seal",
    aspect: "seal",
  },
  "bfp-malaybalay": {
    image: "/images/agencies/bfp.jpg",
    source: "Bureau of Fire Protection (BFP) official seal",
    aspect: "seal",
  },
  "deped-malaybalay": {
    image: "/images/agencies/deped.png",
    source: "https://www.deped.gov.ph/wp-content/uploads/2018/07/DepEd-Website-header-110px_1.png",
    aspect: "wide",
  },
  "buksu-malaybalay": {
    image: "/images/schools/buksu.png",
    source: "https://buksu.edu.ph/ — Bukidnon State University official seal",
    aspect: "seal",
  },
  "tesda-bukidnon-city-scholarship": {
    image: "/images/agencies/tesda.png",
    source: "https://tesda.gov.ph/Content/images/logos/TesdaLogo.png",
    aspect: "seal",
  },
  "peso-malaybalay": {
    image: "/images/offices/peso.png",
    source: "City Government of Malaybalay — Public Employment Service Office (PESO)",
    aspect: "seal",
  },
  "dole-bukidnon": {
    image: "/images/agencies/dole.png",
    source: "Department of Labor and Employment (DOLE) official emblem",
    aspect: "seal",
  },
  "prc-csc-malaybalay": {
    image: "/images/agencies/prc.png",
    source: "Professional Regulation Commission (PRC) official seal",
    aspect: "seal",
  },
  "cho-malaybalay": {
    image: "/images/offices/city-health.jpg",
    source: "City Health Office (CHO) Malaybalay official seal",
    aspect: "seal",
  },
  "bpmc-malasakit-malaybalay": {
    image: "/images/agencies/doh.png",
    source: "Department of Health (DOH) official seal for DOH-supervised medical center & Malasakit desk",
    aspect: "seal",
  },
  "cudho-obo-malaybalay": {
    image: "/images/offices/cudho.jpg",
    source: "City Urban Development & Housing Office / OBO Malaybalay",
    aspect: "seal",
  },
  "rod-lra-bukidnon": {
    image: "/images/agencies/lra.png",
    source: "Land Registration Authority (LRA) Philippines official seal",
    aspect: "seal",
  },
  "dfa-passport-cdo-malaybalay": {
    image: "/images/agencies/dfa.png",
    source: "Department of Foreign Affairs (DFA) official seal",
    aspect: "seal",
  },
  "dmw-owwa-malaybalay": {
    image: "/images/agencies/dmw.png",
    source: "Department of Migrant Workers (DMW) official seal",
    aspect: "seal",
  },
  "cswdo-malaybalay": {
    image: "/images/offices/cswdo.png",
    source: "City Social Welfare and Development Office (CSWDO) Malaybalay",
    aspect: "seal",
  },
  "dswd-swad-bukidnon": {
    image: "/images/agencies/dswd.png",
    source: "Department of Social Welfare and Development (DSWD) official logo",
    aspect: "seal",
  },
  "cto-casso-malaybalay": {
    image: "/images/offices/city-treasurer.png",
    source: "City Treasurer's Office (CTO) Malaybalay official seal",
    aspect: "seal",
  },
  "bir-rdo99-malaybalay": {
    image: "/images/agencies/bir.png",
    source: "https://bir-cdn.bir.gov.ph/BIR/uploads/bir-2024-logo.png",
    aspect: "seal",
  },
  "lto-malaybalay": {
    image: "/images/agencies/lto.png",
    source: "Land Transportation Office (LTO) official seal",
    aspect: "seal",
  },
  "tmc-malaybalay": {
    image: "/images/offices/tmc.png",
    source: "Traffic Management Center (TMC) Malaybalay official seal",
    aspect: "seal",
  },
};
