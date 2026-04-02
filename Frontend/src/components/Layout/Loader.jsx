import React from "react";
import Lottie from "lottie-react";
import loader  from "../../assets/animations/loader.json";// adjust path

const Loader = () => {
  return (
    <div style={styles.container}>
      <Lottie 
        animationData={loader}
        loop={true}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default Loader;
