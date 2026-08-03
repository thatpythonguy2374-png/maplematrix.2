import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import avatar5 from "@/assets/avatar-5.jpg";

const SocialProof = () => {
  const avatars = [
    { src: avatar1, alt: "Client avatar" },
    { src: avatar2, alt: "Client avatar" },
    { src: avatar3, alt: "Client avatar" },
    { src: avatar4, alt: "Client avatar" },
    { src: avatar5, alt: "Client avatar" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start justify-start gap-3 sm:gap-4">
      {/* Avatar Group */}
      <div className="flex -space-x-2.5 flex-shrink-0" role="img" aria-label="Profile photos of happy clients">
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar.src}
            alt=""
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-background object-cover"
            style={{ zIndex: avatars.length - index }}
            loading="lazy"
          />
        ))}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-semibold text-muted-foreground">
          +50
        </div>
      </div>

      {/* Text */}
      <div className="text-left">
        <p className="text-sm sm:text-base text-foreground font-medium">
          Trusted by 50+ startups and growing brands
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="text-primary" aria-label="5 out of 5 stars">★★★★★</span>
          <span>4.9/5 average rating</span>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
