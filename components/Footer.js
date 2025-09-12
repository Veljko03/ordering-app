import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Footer = ({ info }) => {
  return (
    <footer className="bg-background/95 border-t border-orange-400 text-black mt-8">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {info?.logoUrl ? (
              <img
                src={info.logoUrl}
                alt={info?.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
            )}
            <span className="font-display font-bold text-xl">{info?.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {info?.description || "Dobrodošli u naš restoran!"}
          </p>
        </div>

        {/* Kontakt informacije */}
        <div className="space-y-2 text-sm">
          {info?.adress && (
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-400" /> {info.adress}
            </p>
          )}
          {info?.contactPhone && (
            <p className="flex items-center gap-2">
              <FaPhone className="text-orange-400" /> {info.contactPhone}
            </p>
          )}
          {info?.email && (
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-orange-400" /> {info.email}
            </p>
          )}
          {info?.workingHours && (
            <p className="flex items-center gap-2">
              <FaClock className="text-orange-400" /> {info.workingHours}
            </p>
          )}
        </div>

        {/* Društvene mreže */}
        <div className="flex items-center gap-4">
          {info?.social?.instagram && (
            <a
              href={info.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-6 h-6 text-orange-400 hover:scale-110 transition" />
            </a>
          )}
          {info?.social?.facebook && (
            <a
              href={info.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="w-6 h-6 text-orange-400 hover:scale-110 transition" />
            </a>
          )}
          {info?.social?.tiktok && (
            <a
              href={info.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="w-6 h-6 text-orange-400 hover:scale-110 transition" />
            </a>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-orange-400 text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {info?.name || "Restoran"} – Sva prava
        zadržana
      </div>
    </footer>
  );
};

export default Footer;
