type UserCardProps = {
	name: string;
	avatarUrl?: string;
	subtitle?: string;
	className?: string;
};

export const UserCard = ({
	name,
	avatarUrl,
	subtitle,
	className,
}: UserCardProps) => {
	return (
		<article
			className={["user-card", className].filter(Boolean).join(" ")}
			role="listitem"
		>
			{avatarUrl ? (
				<img
					src={avatarUrl}
					alt={name}
					className="user-card__avatar"
					loading="lazy"
				/>
			) : null}

			<div className="user-card__body">
				<h3 className="user-card__name">{name}</h3>
				{subtitle ? (
					<p className="user-card__subtitle">{subtitle}</p>
				) : null}
			</div>
		</article>
	);
};
