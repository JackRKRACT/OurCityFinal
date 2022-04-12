import AuthenticationHome from "./Authentication/AuthenticationHome";
import 'bootstrap/dist/css/bootstrap.min.css';
// The CityMap class will handle all overlayed components onto itself, allowing for the map to act like a 'super-parent' to all deeper functionality.

function HomePage() {
  return (
    <AuthenticationHome/>
  )
}

export default HomePage;
