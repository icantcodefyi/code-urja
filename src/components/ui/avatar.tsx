import React from "react";

interface AvatarProps {
  src: string;
  badge?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ src, badge, size = "md" }) => {
  // Determine dimensions based on size
  const dimensions = {
    sm: { avatar: 40, badge: 16 },
    md: { avatar: 50, badge: 20 },
    lg: { avatar: 80, badge: 24 },
  };
  
  const { avatar, badge: badgeDimension } = dimensions[size];
  
  return (
    <div className="relative" style={{ width: `${avatar}px`, height: `${avatar}px` }}>
      <img
        src={src}
        alt="avatar"
        width={avatar}
        height={avatar}
        className="rounded-full"
      />
      {badge && (
        <img
          src={badge}
          alt="avatar badge"
          width={badgeDimension}
          height={badgeDimension}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
};

export default Avatar;
