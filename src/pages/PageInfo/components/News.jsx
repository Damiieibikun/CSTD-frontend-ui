import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "../../../components/Editor";
import { newsSchema } from "../../../validators/formValidation";
import { ApiContext } from "../../../context/apiContext";
import { Loader } from "../../../components/Loader";

const News = () => {
  const {
    loading,
    news,
    getNews,
    postNews,
    editNews,
    deleteNews
  } = useContext(ApiContext);

  const [editingId, setEditingId] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      brief: "",
      content: "",
      thumbnail: "",
      date: "",
      media: []
    }
  });

  const contentValue = watch("content");

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      media: mediaFiles
    };

    if (editingId) {
      editNews(editingId, formattedData);
    } else {
      postNews(formattedData);
    }

    reset();
    setEditingId(null);
    setMediaFiles([]);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setValue("title", item.title);
    setValue("brief", item.brief);
    setValue("content", item.content);
    setValue("thumbnail", item.thumbnail);
    setValue("date", new Date(item.date).toISOString().split("T")[0]); // input format
    setMediaFiles(item.media || []);
  };

  const handleDelete = (id) => {
    deleteNews(id);
  };

  const handleMediaUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaFiles((prev) => [
      ...prev,
      { type, url, thumbnail: type === "video" ? "" : url }
    ]);
  };

  useEffect(() => {
    getNews();
  }, [getNews]);

  if (loading) return <Loader text="...Loading" />;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          News Management
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Create, edit and manage news articles
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          {editingId ? "Edit News" : "Add News"}
        </h2>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter news title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Brief */}
        <div>
          <label className="block font-semibold mb-1">Brief</label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Enter short news summary"
            {...register("brief")}
          />
          {errors.brief && (
            <p className="text-red-500 text-sm">{errors.brief.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold mb-1">Content</label>
          <Editor
            handle_html={(val) => setValue("content", val)}
            value={contentValue}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block font-semibold mb-1">Thumbnail URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter thumbnail URL"
            {...register("thumbnail")}
          />
          {errors.thumbnail && (
            <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="w-full p-2 border rounded"
            {...register("date")}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Media</label>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleMediaUpload(e, "image")}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleMediaUpload(e, "video")}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-4">
            {mediaFiles.map((m, i) => (
              <div key={i} className="w-32 h-20 border rounded overflow-hidden">
                {m.type === "image" ? (
                  <img
                    src={m.url}
                    alt="media preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video src={m.url} controls className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Save Changes" : "Add News"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
