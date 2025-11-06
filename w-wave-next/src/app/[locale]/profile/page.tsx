"use client";

import { SpotifyLayout } from "@/widgets/layouts/SpotifyLayout";
import { Container } from "@/shared/ui";
import { ProfileEditor } from "@/features/profile/ui/ProfileEditor";

export default function ProfilePage() {
	return (
		<SpotifyLayout>
			<div className="pt-8 pb-6">
				<Container>
					<ProfileEditor />
				</Container>
			</div>
		</SpotifyLayout>
	);
}
