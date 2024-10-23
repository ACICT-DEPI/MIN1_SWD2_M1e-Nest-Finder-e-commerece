
import Delete from "@mui/icons-material/Delete";

export default function DeleteImage({setOld,setDel,OldImages,DeleteImages,img}) {
console.log(OldImages)
  function handleDeleteImage(delImage){
    let olded=OldImages.filter((e)=>e!=delImage)
    setOld(olded)
    setDel([...DeleteImages,delImage])
  }

  return (
    <>
      <Delete
        style={{
          zIndex: "100",
          position: "absolute",
          top: "0px",
          right: "10px",
          color: "white",
          cursor: "pointer",
          background: "red",
        }}
        onClick={() => handleDeleteImage(img)}
      />
    </>
  );
}
