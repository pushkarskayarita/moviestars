import { useEffect } from "react";

export  function useHideComponent(ref,callback) {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				console.log("Outside click!!!!");
				callback();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}
