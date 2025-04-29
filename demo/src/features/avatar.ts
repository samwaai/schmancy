import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Demonstration component for SchmancyAvatar
 */
@customElement('demo-avatars')
export class DemoAvatars extends $LitElement() {
	render() {
		return html`
			<schmancy-surface type="container" class="p-8">
				<schmancy-typography type="headline" token="md" class="mb-4">Avatar Examples</schmancy-typography>

				<!-- Sizes -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Sizes</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="XS" size="xs"></schmancy-avatar>
						<schmancy-avatar initials="SM" size="sm"></schmancy-avatar>
						<schmancy-avatar initials="MD" size="md"></schmancy-avatar>
						<schmancy-avatar initials="LG" size="lg"></schmancy-avatar>
						<schmancy-avatar initials="XL" size="xl"></schmancy-avatar>
					</div>
				</div>

				<!-- Colors -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Colors</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="PR" color="primary"></schmancy-avatar>
						<schmancy-avatar initials="SE" color="secondary"></schmancy-avatar>
						<schmancy-avatar initials="TE" color="tertiary"></schmancy-avatar>
						<schmancy-avatar initials="SU" color="success"></schmancy-avatar>
						<schmancy-avatar initials="ER" color="error"></schmancy-avatar>
						<schmancy-avatar initials="NT" color="neutral"></schmancy-avatar>
					</div>
				</div>

				<!-- Content Types -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Content Types</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="JD"></schmancy-avatar>
						<schmancy-avatar icon="person"></schmancy-avatar>
						<schmancy-avatar icon="home"></schmancy-avatar>
						<schmancy-avatar src="https://i.pravatar.cc/150?img=1"></schmancy-avatar>
						<schmancy-avatar></schmancy-avatar>
						<!-- Default icon -->
					</div>
				</div>

				<!-- Shapes -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Shapes</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="CI" shape="circle"></schmancy-avatar>
						<schmancy-avatar initials="SQ" shape="square"></schmancy-avatar>
						<schmancy-avatar icon="star" shape="square"></schmancy-avatar>
						<schmancy-avatar src="https://i.pravatar.cc/150?img=2" shape="square"></schmancy-avatar>
					</div>
				</div>

				<!-- Bordered -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Bordered</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="BD" bordered></schmancy-avatar>
						<schmancy-avatar icon="favorite" bordered></schmancy-avatar>
						<schmancy-avatar src="https://i.pravatar.cc/150?img=3" bordered></schmancy-avatar>
					</div>
				</div>

				<!-- Status -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Status Indicators</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="ON" status="online"></schmancy-avatar>
						<schmancy-avatar initials="OF" status="offline"></schmancy-avatar>
						<schmancy-avatar initials="BU" status="busy"></schmancy-avatar>
						<schmancy-avatar initials="AW" status="away"></schmancy-avatar>
					</div>
				</div>

				<!-- Combined Examples -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">Combined Examples</schmancy-typography>
					<div class="flex items-center gap-4">
						<schmancy-avatar initials="JP" size="xl" color="primary" bordered status="online"> </schmancy-avatar>

						<schmancy-avatar src="https://i.pravatar.cc/150?img=4" size="lg" shape="square" bordered status="busy">
						</schmancy-avatar>

						<schmancy-avatar icon="work" color="tertiary" size="md" status="away"> </schmancy-avatar>
					</div>
				</div>

				<!-- User Profile Example -->
				<div class="mb-8">
					<schmancy-typography type="title" token="md" class="mb-2">User Profile Example</schmancy-typography>
					<div class="flex items-center gap-4 p-4 rounded-lg bg-surface-high">
						<schmancy-avatar src="https://i.pravatar.cc/150?img=8" size="xl" bordered status="online">
						</schmancy-avatar>
						<div>
							<schmancy-typography type="title" token="md">Jane Smith</schmancy-typography>
							<schmancy-typography type="body" token="md">Product Designer</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Online</schmancy-typography>
						</div>
					</div>
				</div>
			</schmancy-surface>
		`
	}
}
