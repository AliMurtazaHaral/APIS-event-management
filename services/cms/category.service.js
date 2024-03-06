/*
 * Summary:     category.services file for handling all CATEGORY and SUB-CATEGORY - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const category = require("../../database/models").tbl_category;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const imageupload = require("../../middleware/multer_aws_upload");
const xlsx = require("node-xlsx");

module.exports = {
  /* Add Category And Sub-category */

  async addCategory(req, res) {
    let { category_name, parent_id, type } = req.body;
    let find_cat = await category.findOne({
      where: {
        type,
        category_name: category_name,
      },
    });
    if (find_cat) {
      return 1;
    } else {
      let create_cat = await category.create({
        category_name, type,
        parent_id: parent_id === "" ? undefined : parent_id
      });
      return create_cat;
    }
  },

  /* List Category And Sub-category*/

  async listCategory(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    let searchObj;
    search = search === undefined ? "" : search;
    searchObj = {
      where: {
        is_deleted: false,
        [Op.or]: [
          {
            category_name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$parent_category.category_name$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    };
    if (req.body.type === "category") {
      searchObj.where.parent_id = null;
    }
    if (req.body.type === "subcategory") {
      searchObj.where.parent_id = {
        [Op.ne]: null,
      };
    }
    let list_cat = await category.findAndCountAll({
      where: searchObj.where,
      subQuery: false,
      include: [
        {
          model: category,
          attributes: ["category_id", "category_name", "type"],
          as: "parent_category",
        },
      ],
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      attributes: ["category_id", "category_name", "type", "is_active", "createdAt"],
      offset: offset,
      limit: limit,
    });
    return list_cat;
  },

  /* View Category */

  async getCategoryById(req, res) {
    let find_cat = await category.findAll({
      where: { category_id: req.params.id },
      attributes: ["category_id", "category_name", "is_active", "type"],
      include: [
        {
          model: category,
          attributes: ["category_id", "category_name"],
          as: "parent_category",
        },
      ],
    });
    return find_cat;
  },

  /** Category Dropdown */

  async categoryDropdown(req, res) {
    let where = {
      is_deleted: false,
    }

    if (req.body.id) {
      where.parent_id = req.body.id
    }
    if (req.body.type) {
      where.type = req.body.type
    }

    return await category.findAll({
      where: where,
      attributes: ["category_id", "type", "category_name"],
    });;
  },

  /* Update Category And Sub-category */

  async updateCategory(req, res) {
    let { category_name, parent_id, type } = req.body;

    return await category.update({
      category_name, type,
      parent_id: parent_id === "" ? undefined : parent_id
    },
      { where: { category_id: req.body.category_id } }
    );
  },

  /* Update Category And Sub-category Status */

  async updateCategoryStatus(req, res) {
    //is_active = true/false
    let { is_active } = req.body;
    if (req.body.parent_id) {
      find_parent_cat = await category.findOne({
        where: { category_id: req.body.parent_id },
      });
      if (find_parent_cat.is_active === true) {
        await category.update(
          {
            is_active: is_active,
          },
          {
            where: {
              parent_id: req.body.category_id,
            },
          }
        );
        await category.update(
          {
            is_active: is_active,
          },
          {
            where: {
              category_id: req.body.category_id,
            },
          }
        );
      }
      return find_parent_cat.is_active;
    } else {
      let update_status = await category.update(
        { is_active: is_active },
        { where: { category_id: req.body.category_id } }
      );
      await category.update(
        {
          is_active: is_active,
        },
        {
          where: {
            parent_id: req.body.category_id,
          },
        }
      );
      return { update_status };
    }
  },

  /* Delete Category */

  async deleteCategory(req, res) {
    let update_cat_flag = await category.update(
      {
        is_deleted: true,
      },
      {
        where: {
          category_id: req.body.category_id,
        },
      }
    );
    await category.update(
      {
        is_deleted: true,
      },
      {
        where: {
          parent_id: req.body.category_id,
        },
      }
    );
    return update_cat_flag;
  },

  async uploadxlsx(req, res) {
    let category_data = [];
    let filePath = req.files[0].path;
    let obj = xlsx.parse(filePath, { raw: false }); // parses a file
    let { data } = obj[0];
    data.shift();

    for (let i = 0; i < data.length; i++) {
      let record = data[i];
      if (record.length > 0) {
        category_data.push({
          category: record[0],
          type: record[1],
          sub_category: record[2] === undefined ? [] : record[2].split(","),
        });
      }
    }

    category_data.forEach(async (category_result) => {
      let mainCat = await category.findOne({
        where: {
          category_name: category_result.category,
          type: category_result.type,
        },
      });

      if (!mainCat) {
        mainCat = await category.create({
          category_name: category_result.category,
          type: category_result.type,
        });
      }

      category_result.sub_category.forEach(async (sub_category_result) => {
        let find_cat = await category.findOne({
          where: {
            category_name: sub_category_result,
            type: mainCat.type,
          },
        });
        if (!find_cat) {
          await category.create({
            category_name: sub_category_result,
            parent_id: mainCat.category_id,
            type: mainCat.type,
          });
        }
      });
      return 1;

    });
  },
};
