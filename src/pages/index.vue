<template>
	<v-container fill-height>
		<v-row justify="center" align="center">
			<v-col cols="12" sm="4">
				<v-card>
					<v-card-title class="justify-center display-1 font-weight-light">
						Φιδάκι
					</v-card-title>
					<v-card-text class="d-flex justify-center">
						<v-img
							width="500"
							height="500"
							src="http://www.nepaliclass.com/wp-content/uploads/2018/04/snake-and-ladder-board-game.jpg"
						>
						</v-img>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn block rounded color="primary" :to="'/snakes-and-ladders'">
							<v-icon left>mdi-play</v-icon>
							Παίξτε τώρα
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col cols="12" sm="4">
				<v-card>
					<v-card-title class="justify-center display-1 font-weight-light">
						Κάρτες Μνήμης
					</v-card-title>
					<v-card-text class="d-flex justify-center">
						<v-img
							width="500"
							height="500"
							src="http://planningwithkids.com/wp-content/2011/04/Memory-card-game-playing.jpg"
						>
						</v-img>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn rounded block color="primary" :to="'/memory-cards'">
							<v-icon left>mdi-play</v-icon>
							Παίξτε τώρα
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col cols="12" sm="4">
				<v-card>
					<v-card-title class="justify-center display-1 font-weight-light">
						Παζλ
					</v-card-title>
					<v-card-text class="d-flex justify-center">
						<v-img
							width="500"
							height="500"
							src="http://a725.phobos.apple.com/us/r30/Purple/v4/60/9d/4c/609d4cba-7138-8d28-4b1a-e954165c6933/mzl.idzmvbdx.png"
						>
						</v-img>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn block rounded color="primary" :to="'/jigsaw-puzzle'">
							<v-icon left>mdi-play</v-icon>
							Παίξτε τώρα
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {}
</script>
