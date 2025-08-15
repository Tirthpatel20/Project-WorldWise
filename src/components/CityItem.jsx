import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import Flag from "react-world-flags";
import { useCities } from "../pages/contexts/CitiesContext";



const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function emojiToCountryCode(emoji) {
  const codePoints = [...emoji].map((char) =>
    String.fromCharCode(char.codePointAt(0) - 0x1f1e6 + 65)
  );
  return codePoints.join("");
}

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const code = emojiToCountryCode(emoji);

  function handleClick(e){
    e.preventDefault();
    deleteCity(id)
  }

  return (
    <li>
      <Link
        className={`
          ${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }
          `}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <Flag code={code} style={{ width: 30, height: 20, borderRadius: 2 }} />

        <h3 className={styles.name}>{cityName}</h3>

        <time className={styles.date}>({formatDate(date)})</time>

        <button className={styles.deleteBtn} onClick={handleClick}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
