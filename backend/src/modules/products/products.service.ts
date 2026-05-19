import { SupabaseClient } from '@supabase/supabase-js';
import { ListProductsInput, CreateProductInput, UpdateProductInput } from './products.schema';

export const productsService = {

  async list(supabase: SupabaseClient, input: ListProductsInput) {
    const { search, category, page, limit } = input;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('is_active', true)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category) {
      query = query.eq('categories.slug', category);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return { data: data ?? [], total: count ?? 0, page, limit };
  },

  async getById(supabase: SupabaseClient, id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) throw new Error('Product not found');
    return data;
  },

  async create(supabase: SupabaseClient, input: CreateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(supabase: SupabaseClient, id: string, input: UpdateProductInput) {
    const { data, error } = await supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async softDelete(supabase: SupabaseClient, id: string) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Product deleted' };
  },

  async listCategories(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};
