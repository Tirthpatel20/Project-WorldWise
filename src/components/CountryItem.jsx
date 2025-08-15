import styles from "./CountryItem.module.css";
import Flag from "react-world-flags";

function emojiToCountryCode(emoji) {
  const codePoints = [...emoji].map((char) =>
    String.fromCharCode(char.codePointAt(0) - 0x1f1e6 + 65)
  );
  return codePoints.join("");
}
function CountryItem({ country }) {
  const code = emojiToCountryCode(country.emoji);
  console.log(country.emoji)
  return (
    <li className={styles.countryItem}>
      <Flag code={code} style={{ width: 30, height: 20, borderRadius: 2 }} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
