actor User {}

resource Document {
  permissions = ["read", "write"];
  roles = ["owner"];

  # A user has the "read" permission if they have the
  # "contributor" role.
  "read" if "owner";

  # A user has the "push" permission if they have the
  # "maintainer" role.
  "write" if "owner";
}

has_role(user: User, "owner", doc: Document) if
  doc.is_owner(user);

allow(user: User,action,doc: Document) if
  has_permission(user,action,doc);
