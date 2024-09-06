import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'>
      {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

      <Controller
        name={name || "Content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
          <Editor
            apiKey='xblie4m78a0b6jwtb0xzvxzn3plzutwx4dk9juf7dxly9zms'
            value={value} // Use value instead of initialValue
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount"
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
            onEditorChange={(content) => onChange(content)} // Ensure onChange updates the form value
            onBlur={onBlur} // Ensure onBlur is handled
          />
        )}
      />
    </div>
  );
}
