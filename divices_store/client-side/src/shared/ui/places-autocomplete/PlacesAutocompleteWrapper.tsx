"use client";

import { FC } from "react";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";

interface PlacesAutocompleteWrapperProps {
	address: string;
	setAddress: (val: string) => void;
	error?: any;
}

const PlacesAutocompleteWrapper: FC<PlacesAutocompleteWrapperProps> = ({
	address,
	setAddress,
	error,
}) => {
	return (
		<PlacesAutocomplete
			value={address}
			onChange={setAddress}
			onSelect={setAddress}
		>
			{({ getInputProps, suggestions, getSuggestionItemProps }) => (
				<div className="relative">
					<input
						{...getInputProps({
							placeholder: "Address",
							className: `border p-2 w-full rounded-lg text-black ${
								error ? "border-red-500" : ""
							}`,
						})}
					/>
					{suggestions.length > 0 && (
						<div className="absolute z-10 w-full border bg-white mt-1 rounded-lg shadow">
							{suggestions.map((s) => (
								<div
									{...getSuggestionItemProps(s)}
									key={s.placeId}
									className="p-2 cursor-pointer hover:bg-gray-200"
								>
									{s.description}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</PlacesAutocomplete>
	);
};

export default PlacesAutocompleteWrapper;
