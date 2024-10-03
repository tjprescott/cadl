// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Code generated by Microsoft (R) TypeSpec Code Generator.

package com._specs_.azure.core.basic.models;

import com.azure.core.annotation.Generated;
import com.azure.core.annotation.Immutable;
import com.azure.json.JsonReader;
import com.azure.json.JsonSerializable;
import com.azure.json.JsonToken;
import com.azure.json.JsonWriter;
import java.io.IOException;
import java.util.List;

/**
 * The UserList model.
 */
@Immutable
public final class UserList implements JsonSerializable<UserList> {
    /*
     * The users property.
     */
    @Generated
    private final List<User> users;

    /**
     * Creates an instance of UserList class.
     * 
     * @param users the users value to set.
     */
    @Generated
    private UserList(List<User> users) {
        this.users = users;
    }

    /**
     * Get the users property: The users property.
     * 
     * @return the users value.
     */
    @Generated
    public List<User> getUsers() {
        return this.users;
    }

    /**
     * {@inheritDoc}
     */
    @Generated
    @Override
    public JsonWriter toJson(JsonWriter jsonWriter) throws IOException {
        jsonWriter.writeStartObject();
        jsonWriter.writeArrayField("users", this.users, (writer, element) -> writer.writeJson(element));
        return jsonWriter.writeEndObject();
    }

    /**
     * Reads an instance of UserList from the JsonReader.
     * 
     * @param jsonReader The JsonReader being read.
     * @return An instance of UserList if the JsonReader was pointing to an instance of it, or null if it was pointing
     * to JSON null.
     * @throws IllegalStateException If the deserialized JSON object was missing any required properties.
     * @throws IOException If an error occurs while reading the UserList.
     */
    @Generated
    public static UserList fromJson(JsonReader jsonReader) throws IOException {
        return jsonReader.readObject(reader -> {
            List<User> users = null;
            while (reader.nextToken() != JsonToken.END_OBJECT) {
                String fieldName = reader.getFieldName();
                reader.nextToken();

                if ("users".equals(fieldName)) {
                    users = reader.readArray(reader1 -> User.fromJson(reader1));
                } else {
                    reader.skipChildren();
                }
            }
            return new UserList(users);
        });
    }
}