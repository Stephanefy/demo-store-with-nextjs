
import React from 'react';
import { Form, Input, TextArea, Button, Image, Message, Header, Icon} from 'semantic-ui-react';
import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import catchErrors from '../utils/catchErrors';

function CreateProduct() {

  const INITIAL_PRODUCT = {
    name: "",
    price: "",
    media: "",
    description: ""
  }

  const [product, setProduct]= React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled,setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product])


  function handleChange(e){
    const { name, value, files } = e.target;
    if (name === 'media') {
      setProduct((prevState) => ({ ...prevState, media: files[0]}));
      setMediaPreview(window.URL.createObjectURL(files[0]))
    } else {
      setProduct((prevState) => ({...prevState, [name]: value}))
    }
  }

async function handleImageUpload(){
  const data = new FormData()
  data.append('file', product.media)
  data.append('upload_preset', 'react-reserve')
  data.append('cloud_name', 'dpxi6cgs2')
  const response = await axios.post(process.env.CLOUDINARY_URL, data)
  const mediaUrl = response.data.url
  return mediaUrl;

}


  async function handleSubmit(e){
    try{
      e.preventDefault();
      setLoading(true);
      setError('');
      const mediaUrl = await handleImageUpload()
      const url = `${baseUrl}/api/product`;
      const {name, price, description} = product;
      const payload = { name, price, description, mediaUrl};
      const response = await axios.post(url, payload);
      console.log({ response });
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch(error){
      catchErrors(error, setError)
    } finally {
      setLoading(false);
    }
  }




  return (
    <>
    <Header as="h2" block>
      <Icon name="add" color="orange"/>
      Ajouter un nouveau produit
    </Header>  
    <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
    <Message
      error
      header="Oops"
      content={error}
    />
    <Message
      success
      icon="check"
      header="Success"
      content="Your product has been posted"
    />
      <Form.Group widths="equal">
        <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            type="text"
            value={product.name}
            onChange={handleChange}
        />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}

        />
            <Form.Field
            control={Input}
            name="media"
            label="Media"
            content="Sélectionner une image"
            type="file"
            accept="image/*"
            onChange={handleChange}
        />
      </Form.Group>
      <Image src={mediaPreview} rounded centered size="small"/>
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          onChange={handleChange}
          value={product.description}
        />
        <Form.Field
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="continuer"
          type="submit"
          disabled={disabled || loading}
        />  
    </Form>
    </>
  );
}

export default CreateProduct;
