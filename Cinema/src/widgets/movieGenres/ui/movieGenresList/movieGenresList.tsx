import { FC } from "react";

interface MovieGenresListProps {
	genres: Array<string>;
}

const MovieGenresList: FC<MovieGenresListProps> = ({ genres }) => {
	return (
		<div className="List-wrapper">
			<h1>
				<p>{genres}</p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
				Perferendis, quae!
			</h1>
		</div>
	);
};

export default MovieGenresList;
