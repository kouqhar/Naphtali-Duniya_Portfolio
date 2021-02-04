const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { format, locale: {eo} } = require('date-fns')
// const currentDate = format(new Date(), 'yyyy-MM-dd')

// Create Upload Schema
const UploadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  image: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      post: {
        type: Schema.Types.ObjectId,
        ref: "post_upload",
      },
      fieldname: {
        type: String,
      },
      originalname: {
        type: String,
      },
      encoding: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      destination: {
        type: String,
      },
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      size: {
        type: Number,
      },
      cloudinaryPath: {
        type: String,
      },
      text: {
        type: String,
        default: `Uploaded on the ${Date.now}`,
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
      dateUpdated: {
        type: Date,
        default: Date.now,
      },
      dateRemoved: {
        type: Date,
      },
    },
  ],
  audio: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      post: {
        type: Schema.Types.ObjectId,
        ref: "post_upload",
      },
      fieldname: {
        type: String,
      },
      originalname: {
        type: String,
      },
      encoding: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      destination: {
        type: String,
      },
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      size: {
        type: Number,
      },
      cloudinaryPath: {
        type: String,
      },
      text: {
        type: String,
        default: `Uploaded on the ${Date.now}`,
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
      dateUpdated: {
        type: Date,
        default: Date.now,
      },
      dateRemoved: {
        type: Date,
      },
    },
  ],
  video: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      post: {
        type: Schema.Types.ObjectId,
        ref: "post_upload",
      },
      fieldname: {
        type: String,
      },
      originalname: {
        type: String,
      },
      encoding: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      destination: {
        type: String,
      },
      filename: {
        type: String,
      },
      path: {
        type: String,
      },
      size: {
        type: Number,
      },
      cloudinaryPath: {
        type: String,
      },
      text: {
        type: String,
        default: `Uploaded on the ${Date.now}`,
      },
      dateAdded: {
        type: Date,
        default: Date.now,
      },
      dateUpdated: {
        type: Date,
        default: Date.now,
      },
      dateRemoved: {
        type: Date,
      },
    },
  ],
  album: {
    images: [
      {
        post: {
          type: Schema.Types.ObjectId,
          ref: "post_upload",
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        images_array: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "user",
            },
            post: {
              type: Schema.Types.ObjectId,
              ref: "post_upload",
            },
            fieldname: {
              type: String,
            },
            originalname: {
              type: String,
            },
            encoding: {
              type: String,
            },
            mimetype: {
              type: String,
            },
            destination: {
              type: String,
            },
            filename: {
              type: String,
            },
            path: {
              type: String,
            },
            size: {
              type: Number,
            },
            cloudinaryPath: {
              type: String,
            },
            text: {
              type: String,
              default: `Uploaded on the ${Date.now}`,
            },
            dateAdded: {
              type: Date,
              default: Date.now,
            },
            dateUpdated: {
              type: Date,
              default: Date.now,
            },
            dateRemoved: {
              type: Date,
            },
          },
        ],
        dateAdded: {
          type: Date,
          default: Date.now,
        },
        dateUpdated: {
          type: Date,
          default: Date.now,
        },
        dateRemoved: {
          type: Date,
        },
      },
    ],
    audios: [
      {
        post: {
          type: Schema.Types.ObjectId,
          ref: "post_upload",
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        audios_array: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "user",
            },
            post: {
              type: Schema.Types.ObjectId,
              ref: "post_upload",
            },
            fieldname: {
              type: String,
            },
            originalname: {
              type: String,
            },
            encoding: {
              type: String,
            },
            mimetype: {
              type: String,
            },
            destination: {
              type: String,
            },
            filename: {
              type: String,
            },
            path: {
              type: String,
            },
            size: {
              type: Number,
            },
            cloudinaryPath: {
              type: String,
            },
            text: {
              type: String,
              default: `Uploaded on the ${Date.now}`,
            },
            dateAdded: {
              type: Date,
              default: Date.now,
            },
            dateUpdated: {
              type: Date,
              default: Date.now,
            },
            dateRemoved: {
              type: Date,
            },
          },
        ],
        dateAdded: {
          type: Date,
          default: Date.now,
        },
        dateUpdated: {
          type: Date,
          default: Date.now,
        },
        dateRemoved: {
          type: Date,
        },
      },
    ],
    videos: [
      {
        post: {
          type: Schema.Types.ObjectId,
          ref: "post_upload",
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        videos_array: [
          {
            user: {
              type: Schema.Types.ObjectId,
              ref: "user",
            },
            post: {
              type: Schema.Types.ObjectId,
              ref: "post_upload",
            },
            fieldname: {
              type: String,
            },
            originalname: {
              type: String,
            },
            encoding: {
              type: String,
            },
            mimetype: {
              type: String,
            },
            destination: {
              type: String,
            },
            filename: {
              type: String,
            },
            path: {
              type: String,
            },
            size: {
              type: Number,
            },
            cloudinaryPath: {
              type: String,
            },
            text: {
              type: String,
              default: `Uploaded on the ${Date.now}`,
            },
            dateAdded: {
              type: Date,
              default: Date.now,
            },
            dateUpdated: {
              type: Date,
              default: Date.now,
            },
            dateRemoved: {
              type: Date,
            },
          },
        ],
        dateAdded: {
          type: Date,
          default: Date.now,
        },
        dateUpdated: {
          type: Date,
          default: Date.now,
        },
        dateRemoved: {
          type: Date,
        },
      },
    ],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create Upload Model in the database
const Upload = mongoose.model("upload", UploadSchema);

module.exports = { Upload };
