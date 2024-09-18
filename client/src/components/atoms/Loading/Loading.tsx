import { Spin } from "antd";

export const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center", // Corrected property
      }}
    >
      <Spin size='large' style={{ fontSize: 30 }} />
    </div>
  );
};
