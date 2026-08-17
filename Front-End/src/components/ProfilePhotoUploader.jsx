import { useRef, useState } from "react";
import { Camera, LoaderCircle, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import axios from "../api/axios";
import { fileUrl } from "../config/api";

export default function ProfilePhotoUploader({ user, onUpdated, size = "md" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const dimensions = size === "lg" ? "h-24 w-24" : "h-20 w-20";
  const image = user?.profileImage || user?.avatar;

  const updateUser = (nextUser) => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...stored, ...nextUser }));
    onUpdated(nextUser);
  };

  const upload = async (event) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      return toast.error("Select a JPG, PNG, or WebP image");
    }
    if (selected.size > 2 * 1024 * 1024) {
      return toast.error("Profile image must be 2MB or smaller");
    }

    try {
      setBusy(true);
      const form = new FormData();
      form.append("profileImage", selected);
      const response = await axios.patch("/auth/profile-picture", form);
      updateUser(response.data.user);
      toast.success(response.data.message || "Profile picture updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not upload profile picture");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    try {
      setBusy(true);
      const response = await axios.delete("/auth/profile-picture");
      updateUser(response.data.user);
      toast.success(response.data.message || "Profile picture removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove profile picture");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className={`relative ${dimensions}`}>
        <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow ring-1 ring-gray-200">
          {image ? (
            <img
              src={fileUrl(image)}
              alt={`${user?.name || "User"} profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-gray-400">
              <UserRound className="h-10 w-10" />
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title={image ? "Change profile picture" : "Add profile picture"}
          className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-gray-900 text-white shadow disabled:opacity-60"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={upload}
          className="sr-only"
        />
      </div>
      {image && (
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          title="Remove profile picture"
          className="grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
