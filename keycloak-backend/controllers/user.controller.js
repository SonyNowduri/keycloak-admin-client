// const orderStatus = async function (req, res) {
//   let text = "";
//   switch (req?.params?.scope || "create") {
//     case "create":
//       text = "Order Created Successfully";
//       break;
//     case "update":
//       text = "Order Updated Successfully";
//       break;
//     case "read":
//       text = "Order view Successfully";
//       break;
//     case "delete":
//       text = "Order deleted Successfully";
//       break;
//     default:
//       text = "No value found";
//   }
//   return res.status(200).json(text);
// };

const orderStatus = async function (req, res) {
  return res.status(200).json("Order sucess");
};

const createOrder = async function (req, res) {
  return res.status(200).json("Order Created Successfully");
};

const updateOrder = async function (req, res) {
  return res.status(200).json("Order Updated Successfully");
};
const viewOrder = async function (req, res) {
  console.log(req.permissions, "ssssss");
  return res.status(200).json("Order Details Fetched Successfully");
};
const deleteOrder = async function (req, res) {
  return res.status(200).json("Order Deleted Successfully");
};
export { orderStatus, createOrder, updateOrder, viewOrder, deleteOrder };
